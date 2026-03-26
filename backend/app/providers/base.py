from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncGenerator

class BaseProvider(ABC):
    """大模型提供商基类"""

    def __init__(self, model: str, config: Dict[str, Any]):
        self.model = model
        self.config = config
        self.max_tokens = config.get("max_tokens", 4096)
        self.temperature = config.get("temperature", 0.7)

    @abstractmethod
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        stream: bool = True,
    ) -> AsyncGenerator[str, None]:
        """
        聊天补全接口
        :param messages: 对话历史列表，格式为 [{"role": "user", "content": "xxx"}, ...]
        :param stream: 是否流式输出
        :return: 异步生成器，返回响应内容
        """
        pass
