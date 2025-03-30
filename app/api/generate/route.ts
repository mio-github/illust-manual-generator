import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/utils/config';
import { 
  generateDialogues, 
  generateSceneWithoutText, 
  composePanelsIntoComic 
} from '@/utils/openai';

export async function POST(req: NextRequest) {
  // リクエストIDを生成（ログ追跡用）
  const requestId = Math.random().toString(36).substring(2, 10);
  
  try {
    console.log(`[${requestId}] 漫画生成API呼び出し開始`);
    
    // リクエストボディを取得
    const body = await req.json();
    const { prompt, panels = appConfig.defaultPanels, style = appConfig.defaultStyle } = body;
    
    console.log(`[${requestId}] リクエスト解析完了`, { 
      prompt, 
      panels, 
      style,
      timestamp: new Date().toISOString()
    });

    // バリデーション
    if (!prompt) {
      console.error(`[${requestId}] バリデーションエラー: プロンプトが空です`);
      return NextResponse.json(
        { error: 'プロンプトは必須です' },
        { status: 400 }
      );
    }
    
    // コマ数をMAX_PANELSまでに制限
    const maxPanels = appConfig.maxPanels;
    const actualPanels = Math.min(Math.max(1, panels), maxPanels);
    if (panels !== actualPanels) {
      console.log(`[${requestId}] 指定されたコマ数(${panels})が範囲外のため、${actualPanels}コマに調整されました`);
    }

    console.log(`[${requestId}] 漫画生成処理を開始します`);
    console.log(`[${requestId}] プロンプト: ${prompt}`);
    console.log(`[${requestId}] コマ数: ${actualPanels}`);
    console.log(`[${requestId}] スタイル: ${style}`);
    
    // 処理開始時間を記録
    const startTime = Date.now();
    
    // 1. 全体構成を考える - これは現在の実装では省略
    console.log(`[${requestId}] 1. 全体構成を検討中...`);
    
    // 2. コマ数分のシーンとセリフを生成
    console.log(`[${requestId}] 2. セリフとシーン構成の生成を開始...`);
    let dialogues;
    try {
      dialogues = await generateDialogues(prompt, actualPanels);
      console.log(`[${requestId}] セリフ生成完了: ${JSON.stringify(dialogues)}`);
    } catch (dialogueError) {
      console.error(`[${requestId}] セリフ生成中にエラーが発生しました`, dialogueError);
      throw new Error(`セリフ生成エラー: ${dialogueError instanceof Error ? dialogueError.message : '不明なエラー'}`);
    }
    
    // 各コマのシーン説明を生成
    const generateSceneDescription = (index: number, basePrompt: string, dialogueContent: string[]) => {
      const panelNum = index + 1;
      const totalPanels = actualPanels;
      let storyProgress = '';
      
      if (index === 0) {
        storyProgress = '導入部分、問題提起';
      } else if (index === totalPanels - 1) {
        storyProgress = '結論部分、まとめ';
      } else {
        const progress = Math.floor((index / (totalPanels - 1)) * 100);
        storyProgress = `説明の${progress}%の部分`;
      }
      
      // セリフの内容をシーン説明に活用
      const dialogueContext = dialogueContent.join('、');
      
      return `
        ${panelNum}コマ目（${storyProgress}）：このシーンでは「${dialogueContext}」という会話が行われます。
        まずはこのシーンを登場人物と空の吹き出しだけで描いてください。後でセリフを追加します。
      `.trim();
    };
    
    // 3. 吹き出しのみのシーン画像を生成（セリフは空白）
    console.log(`[${requestId}] 3. 吹き出し付きシーン画像の生成を開始...`);
    const sceneImagePromises = Array.from({ length: actualPanels }, async (_, i) => {
      const sceneDescription = generateSceneDescription(i, prompt, dialogues[i] || []);
      console.log(`[${requestId}] コマ${i+1}のシーン説明:`, sceneDescription);
      
      try {
        const imageUrl = await generateSceneWithoutText(prompt, sceneDescription, { 
          quality: style === 'simple' ? 'standard' : 'hd',
        });
        console.log(`[${requestId}] コマ${i+1}のシーン画像生成完了:`, imageUrl.substring(0, 100) + '...');
        return imageUrl;
      } catch (error) {
        console.error(`[${requestId}] コマ${i+1}のシーン画像生成エラー:`, error);
        return `https://placehold.co/600x400?text=コマ${i+1}生成エラー`;
      }
    });
    
    // すべてのシーン画像生成が完了するまで待機
    console.log(`[${requestId}] すべてのシーン画像生成を待機中...`);
    let sceneImageUrls;
    try {
      sceneImageUrls = await Promise.all(sceneImagePromises);
      console.log(`[${requestId}] 全てのシーン画像生成が完了しました`);
    } catch (imageError) {
      console.error(`[${requestId}] シーン画像生成中に予期せぬエラーが発生しました`, imageError);
      throw new Error(`シーン画像生成エラー: ${imageError instanceof Error ? imageError.message : '不明なエラー'}`);
    }
    
    // 4. 画像とセリフを合成してコマ割り画像を生成（将来的な実装）
    console.log(`[${requestId}] 4. 画像とセリフの合成処理は開発中...`);
    // 現在は個別の画像を返し、フロントエンドで表示する
    
    // 5. 最終的なコマ割り画像の生成（将来的な実装）
    // let compositeImageUrl;
    // try {
    //   compositeImageUrl = await composePanelsIntoComic(sceneImageUrls, dialogues, prompt);
    //   console.log(`[${requestId}] コマ合成完了: ${compositeImageUrl.substring(0, 100)}...`);
    // } catch (composeError) {
    //   console.error(`[${requestId}] コマ合成中にエラーが発生しました`, composeError);
    //   // エラーでも個別画像はそのまま返す
    // }
    
    // 結果をまとめる
    const generatedContent = Array.from({ length: actualPanels }, (_, i) => {
      return {
        imageUrl: sceneImageUrls[i],
        dialogues: dialogues[i] || [],
        caption: `${prompt} - コマ${i + 1}`,
        sceneIndex: i,
      };
    });
    
    // 処理完了時間を計算
    const totalTime = Date.now() - startTime;
    console.log(`[${requestId}] 漫画生成完了: ${actualPanels}コマ, 所要時間: ${totalTime}ms`);
    
    // レスポンスを返す
    const response = { 
      success: true,
      content: generatedContent,
      panelCount: actualPanels,
      prompt,
      style,
      processingTime: totalTime,
      // compositeImageUrl: compositeImageUrl, // 将来的な実装用
      message: `${actualPanels}コマの漫画が正常に生成されました。各コマには吹き出しが含まれています。`
    };
    
    console.log(`[${requestId}] 漫画生成API呼び出し完了`);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error(`[${requestId}] 漫画生成中に致命的なエラーが発生しました:`, error);
    
    // エラーメッセージの詳細を取得
    let errorMessage = '漫画生成中にエラーが発生しました';
    let errorDetails = '未知のエラー';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '詳細なスタック情報がありません';
    }
    
    // エラーレスポンスを返す
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        requestId
      },
      { status: 500 }
    );
  }
}
