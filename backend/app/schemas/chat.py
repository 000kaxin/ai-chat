from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Message(BaseModel):
    """消息模型"""
    role: str = Field(..., description="角色：user/assistant/system")
    content: str = Field(..., description="消息内容")

class ChatRequest(BaseModel):
    """聊天请求模型"""
    model: str = Field(..., description="模型ID")
    messages: List[Message] = Field(..., description="对话历史")
    temperature: float = Field(0.7, ge=0, le=2, description="温度参数")
    max_tokens: int = Field(4096, ge=1, le=128000, description="最大生成长度")
    stream: bool = Field(True, description="是否流式响应")
    system_prompt: Optional[str] = Field(None, description="系统提示词")

class ModelInfo(BaseModel):
    """模型信息模型"""
    id: str = Field(..., description="模型ID")
    name: str = Field(..., description="模型名称")
    provider: str = Field(..., description="提供商")
    status: str = Field(..., description="状态：available/unavailable")

class ChatResponse(BaseModel):
    """聊天响应模型（非流式）"""
    content: str = Field(..., description="响应内容")
    model: str = Field(..., description="使用的模型")
    usage: Optional[Dict[str, Any]] = Field(None, description="token使用统计")

class ErrorResponse(BaseModel):
    """错误响应模型"""
    error: str = Field(..., description="错误信息")
    code: int = Field(..., description="错误码")
