from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    """应用配置"""

    # 服务配置
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    SECRET_KEY: str = "default-secret-key-change-in-production"

    # API Key 配置
    BAIDU_API_KEY: Optional[str] = None
    BAIDU_SECRET_KEY: Optional[str] = None
    DASHSCOPE_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"

    # 数据库配置
    DATABASE_URL: str = "sqlite+aiosqlite:///./chat.db"

    # CORS 配置
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # 模型配置
    DEFAULT_MODEL: str = "ernie-4.0"
    MAX_TOKENS: int = 4096
    TEMPERATURE: float = 0.7

    # 支持的模型列表
    SUPPORTED_MODELS: List[dict] = [
        # 百度文心一言
        {"id": "ernie-4.0", "name": "文心一言 4.0", "provider": "baidu"},
        {"id": "ernie-3.5", "name": "文心一言 3.5", "provider": "baidu"},
        {"id": "ernie-speed", "name": "文心一言 极速版", "provider": "baidu"},

        # 阿里通义千问
        {"id": "qwen-max", "name": "通义千问 Max", "provider": "alibaba"},
        {"id": "qwen-plus", "name": "通义千问 Plus", "provider": "alibaba"},
        {"id": "qwen-turbo", "name": "通义千问 Turbo", "provider": "alibaba"},

        # Claude
        {"id": "claude-3-opus-20240229", "name": "Claude 3 Opus", "provider": "anthropic"},
        {"id": "claude-3-sonnet-20240229", "name": "Claude 3 Sonnet", "provider": "anthropic"},
        {"id": "claude-3-haiku-20240307", "name": "Claude 3 Haiku", "provider": "anthropic"},

        # GPT
        {"id": "gpt-4o", "name": "GPT-4o", "provider": "openai"},
        {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "provider": "openai"},
        {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "openai"},
    ]

    def get_model_provider(self, model_id: str) -> Optional[str]:
        """获取模型对应的提供商"""
        for model in self.SUPPORTED_MODELS:
            if model["id"] == model_id:
                return model["provider"]
        return None

    def is_model_available(self, model_id: str) -> bool:
        """检查模型是否可用（配置了对应的API Key）"""
        provider = self.get_model_provider(model_id)
        if not provider:
            return False

        if provider == "baidu":
            return self.BAIDU_API_KEY is not None and self.BAIDU_SECRET_KEY is not None
        elif provider == "alibaba":
            return self.DASHSCOPE_API_KEY is not None
        elif provider == "anthropic":
            return self.ANTHROPIC_API_KEY is not None
        elif provider == "openai":
            return self.OPENAI_API_KEY is not None
        return False

    class Config:
        env_file = ".env"

settings = Settings()
