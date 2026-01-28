#!/bin/bash
# 修复端口占用脚本
# 使用方法: ./fix-port.sh

echo "正在检查端口占用情况..."

# 检查并停止占用 3000, 3001, 3002 端口的进程
PORTS=(3000 3001 3002)
for port in "${PORTS[@]}"; do
  PID=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo "发现端口 $port 被进程 $PID 占用，正在停止..."
    kill $PID 2>/dev/null || kill -9 $PID 2>/dev/null
    sleep 1
    # 验证是否已停止
    if lsof -ti:$port >/dev/null 2>&1; then
      echo "⚠️  警告: 进程 $PID 仍在运行，可能需要手动停止"
    else
      echo "✓ 端口 $port 已释放"
    fi
  else
    echo "✓ 端口 $port 未被占用"
  fi
done

echo ""
echo "端口清理完成！现在可以运行: npm run dev"
