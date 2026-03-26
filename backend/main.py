from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import api_router

# 创建 FastAPI 应用
app = FastAPI(
    title="AI Chat API",
    description="支持多种大模型的聊天API服务",
    version="1.0.0",
    debug=settings.DEBUG,
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(api_router)

@app.get("/", summary="健康检查")
async def root():
    """健康检查接口"""
    return {
        "status": "ok",
        "message": "AI Chat API Service is running",
        "version": "1.0.0"
    }

@app.get("/health", summary="健康检查")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
