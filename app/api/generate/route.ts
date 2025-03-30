import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/utils/config';
import { generateDialogues, generateImage } from '@/utils/openai';

export async function POST(req: NextRequest) {
  try {
    console.log('画像生成APIが呼び出されました');
    
    // リクエストボディを取得
    const body = await req.json();
    const { prompt, panels = appConfig.defaultPanels, style = appConfig.defaultStyle } = body;
    
    console.log('リクエスト内容:', { prompt, panels, style });

    // バリデーション
    if (!prompt) {
      console.error('バリデーションエラー: プロンプトが空です');
      return NextResponse.json(
        { error: 'プロンプトは必須です' },
        { status: 400 }
      );
    }
    
    // コマ数をMAX_PANELSまでに制限
    const maxPanels = appConfig.maxPanels;
    const actualPanels = Math.min(Math.max(1, panels), maxPanels);
    if (panels !== actualPanels) {
      console.log(`指定されたコマ数(${panels})が範囲外のため、${actualPanels}コマに調整されました`);
    }

    console.log('漫画生成処理を開始します...');
    console.log(`プロンプト: ${prompt}`);
    console.log(`コマ数: ${actualPanels}`);
    console.log(`スタイル: ${style}`);
    
    // まずセリフを生成
    console.log('1. セリフ生成を開始...');
    const dialogues = await generateDialogues(prompt, actualPanels);
    console.log('セリフ生成完了:', dialogues);
    
    // 日本語プロンプトを英語に翻訳したい場合はここでAPIを呼び出す
    // const translatedPrompt = await translateToEnglish(prompt);
    
    // 各コマの画像生成プロンプトを作成
    const generatePanelPrompt = (index: number, basePrompt: string) => {
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
      
      // セリフの内容を画像生成に活用
      const dialogueContext = dialogues[index]?.join('、') || '';
      
      return `
        4コマ漫画の${panelNum}コマ目（${storyProgress}）：${basePrompt}
        コマの内容: ${dialogueContext}
        スタイル: ${style}、日本語の漫画、シンプルで見やすい構図、2人の登場人物
      `.trim();
    };
    
    // 画像生成
    console.log('2. 画像生成を開始...');
    const imagePromises = Array.from({ length: actualPanels }, async (_, i) => {
      const panelPrompt = generatePanelPrompt(i, prompt);
      console.log(`コマ${i+1}の画像生成プロンプト:`, panelPrompt.substring(0, 100) + '...');
      
      try {
        const imageUrl = await generateImage(panelPrompt, { 
          quality: style === 'simple' ? 'standard' : 'hd',
        });
        console.log(`コマ${i+1}の画像生成完了:`, imageUrl.substring(0, 50) + '...');
        return imageUrl;
      } catch (error) {
        console.error(`コマ${i+1}の画像生成エラー:`, error);
        return `https://placehold.co/600x400?text=コマ${i+1}生成エラー`;
      }
    });
    
    const imageUrls = await Promise.all(imagePromises);
    console.log('全ての画像生成が完了しました');
    
    // 結果をまとめる
    const generatedContent = Array.from({ length: actualPanels }, (_, i) => {
      return {
        imageUrl: imageUrls[i],
        dialogues: dialogues[i] || [],
        caption: `${prompt} - パート${i + 1}`,
      };
    });
    
    console.log(`${actualPanels}コマの漫画とセリフを生成しました`);
    
    return NextResponse.json({ 
      success: true,
      content: generatedContent,
      panelCount: actualPanels,
      prompt,
      style,
      message: `${actualPanels}コマのイラストとセリフが正常に生成されました`
    });
    
  } catch (error) {
    console.error('漫画生成エラー:', error);
    return NextResponse.json(
      { 
        error: '漫画生成中にエラーが発生しました', 
        details: error instanceof Error ? error.message : '未知のエラー' 
      },
      { status: 500 }
    );
  }
}
