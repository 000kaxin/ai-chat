from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
from app.schemas.chat import ChatRequest, ModelInfo, ErrorResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.get("/models", response_model=List[ModelInfo], summary="获取可用模型列表")
async def get_models():
    """获取所有支持的模型列表及可用状态"""
    return ChatService.get_available_models()

@router.post("/stream", summary="流式聊天接口")
async def chat_stream(request: ChatRequest):
    """
    流式聊天接口，返回SSE事件流
    每个事件是一段文本内容，客户端逐段拼接即可
    """
    try:
        async def generate():
            async for chunk in ChatService.chat_completion(
                model=request.model,
                messages=request.messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                stream=request.stream,
                system_prompt=request.system_prompt,
            ):
                # SSE 格式: data: 内容\n\n
                yield f"data: {chunk}\n\n"
            # 结束标志
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
