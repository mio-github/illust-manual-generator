# ナビゲーションイラスト生成ツール

セリフ付きのナビゲーションイラストを簡単に生成・編集できるWebアプリケーションです。GPT-4oとDALL-E 3の力を活用して、説明文からイラストを自動生成します。

## 主な機能

- プロンプトからマルチパネルイラストを生成
- 吹き出しとセリフの自由な配置とスタイル編集
- 日本語、英語、中国語、韓国語のマルチ言語対応
- プロジェクトの保存と読み込み
- 画像のエクスポート（PNG形式）

## 開発環境のセットアップ

### 必要条件

- Node.js 18.0.0以上
- npm 9.0.0以上
- OpenAI API キー

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/mio-github/illust-manual-generator.git
cd illust-manual-generator
```

2. 依存パッケージをインストール
```bash
npm install
```

3. 環境変数の設定
プロジェクトのルートに `.env.local` ファイルを作成し、以下の内容を設定します:

```
# LLMの設定
# APIキーはVercel環境変数またはローカルのみで設定すること（GitHubにコミットしないこと）
OPENAI_API_KEY=sk-あなたのOpenAIのAPIキー
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# 画像生成の設定
IMAGE_GENERATION_API=openai
IMAGE_GENERATION_MODEL=dall-e-3
IMAGE_QUALITY=hd
IMAGE_SIZE=1024x1024

# アプリケーション設定
MAX_PANELS=6
DEFAULT_PANELS=4
DEFAULT_STYLE=default
```

**重要**: APIキーは絶対にGitHubにコミットしないでください。`.env.local`ファイルは`.gitignore`に追加されていますが、念のため確認してください。

4. 開発サーバーを起動
```bash
npm run dev
```

5. ブラウザで http://localhost:3000 にアクセス

## 本番環境へのデプロイ

このプロジェクトはVercelにデプロイするのが推奨されています。

1. Vercelアカウントを作成し、Vercel CLIをインストール
```bash
npm install -g vercel
```

2. Vercelにログイン
```bash
vercel login
```

3. プロジェクトをデプロイ
```bash
vercel --prod
```

4. Vercelのプロジェクト設定で、環境変数（特にOPENAI_API_KEY）を設定

## ライセンス

© 2025 Mio System Co.,Ltd. All rights reserved. 