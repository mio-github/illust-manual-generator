import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // リクエストからURLを取得
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URLが指定されていません' });
  }

  try {
    // URLから画像を取得
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `画像の取得に失敗しました: ${response.statusText}` 
      });
    }

    // 画像のバイナリデータを取得
    const imageBuffer = await response.arrayBuffer();
    
    // Content-Typeを設定
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // ヘッダーを設定して画像データを返す
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('画像のプロキシ処理中にエラーが発生しました:', error);
    res.status(500).json({ error: '画像の取得中にエラーが発生しました' });
  }
} 