import asyncio
import threading

from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

from app.config import settings


class IBMClient:
    def __init__(self):
        self.credentials = {
            "url": settings.IBM_URL,
            "apikey": settings.IBM_API_KEY,
        }

        self.project_id = settings.IBM_PROJECT_ID
        self.model_id = settings.IBM_MODEL_ID
        self._model = None
        self._lock = threading.Lock()

    @property
    def model(self):
        if self._model is None:
            if not self.credentials.get("apikey") or not self.project_id:
                raise Exception(
                    "IBM API credentials not configured. "
                    "Please set IBM_API_KEY and IBM_PROJECT_ID in the .env file."
                )

            self._model = Model(
                model_id=self.model_id,
                credentials=self.credentials,
                params=self._build_params(settings.IBM_MAX_TOKENS_CHAT),
                project_id=self.project_id,
            )

        return self._model

    @staticmethod
    def _build_params(max_tokens: int) -> dict:
        return {
            GenParams.DECODING_METHOD: "sample",
            GenParams.MAX_NEW_TOKENS: max_tokens,
            GenParams.MIN_NEW_TOKENS: 32,
            GenParams.TEMPERATURE: 0.3,
            GenParams.TOP_P: 0.9,
            GenParams.REPETITION_PENALTY: 1.1,
            GenParams.STOP_SEQUENCES: [
                "User:",
                "Current User Request:",
                "Assistant:",
            ],
        }

    async def generate_text(
        self,
        prompt: str,
        max_tokens: int | None = None,
    ) -> str:
        try:

            def _generate() -> str:
                with self._lock:
                    tokens = max_tokens or settings.IBM_MAX_TOKENS_CHAT
                    self.model.params = self._build_params(tokens)
                    return self.model.generate_text(prompt)

            response = await asyncio.to_thread(_generate)

            if not response or not str(response).strip():
                raise Exception("IBM API returned an empty response")

            text = str(response).strip()

            # Remove common prompt echoes
            prefixes = [
                "Assistant:",
                "assistant:",
                "Response:",
                "### Response",
                "### Assistant",
            ]

            for prefix in prefixes:
                if text.startswith(prefix):
                    text = text[len(prefix):].strip()

            # Remove leaked prompt sections if they appear at the beginning
            leaked_starts = (
                "Instructions:",
                "### Instructions",
                "Student Profile",
                "Previous Conversation",
                "Current User Request",
            )

            for marker in leaked_starts:
                if text.startswith(marker):
                    split_index = text.find("\n\n")
                    if split_index != -1:
                        text = text[split_index:].strip()

            # Normalize blank lines
            while "\n\n\n" in text:
                text = text.replace("\n\n\n", "\n\n")

            return text

        except Exception as e:
            if "IBM API" in str(e):
                raise

            raise Exception(f"IBM API error: {str(e)}")


ibm_client = IBMClient()