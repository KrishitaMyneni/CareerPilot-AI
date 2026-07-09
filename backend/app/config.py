from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    MONGODB_URI: str
    IBM_API_KEY: str
    IBM_PROJECT_ID: str
    IBM_URL: str = "https://us-south.ml.cloud.ibm.com"
    IBM_MODEL_ID: str = "ibm/granite-4-h-small"
    IBM_MAX_TOKENS_CHAT: int = 700
    IBM_MAX_TOKENS_ANALYSIS: int = 1200


settings = Settings()
