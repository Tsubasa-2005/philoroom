# プロダライベート知能議論サービス PhiloRoom - MVP要件定義

## 概要
PhiloRoomは、ユーザーがテーマを投げかけると、そのテーマに適した多様な視点や信念を持つAIたちが自動的に生成され論語を開始。ユーザーが言語を払うことで、再びAIたちの論語が繰り復され、自分の思考を深めることができる「知性のための議論サーロン」である。

---

## 基本機能

### 1. プロンプト投入
- ユーザーが自由なテーマや意見を投げる
- 例: "AIが教育を管理する未来は良いことか悪いことか"

### 2. 視点抽出AI (Meta AI)
- GPT-4の一段階の解析として、投入されたプロンプトから「論語に有効な視点」を3~5個抽出
- 返却形式:
```json
[
  {"name": "Techno-Optimist", "stance": "Believes AI can democratize education and make it more efficient."},
  {"name": "Humanist", "stance": "Education requires emotional and human connection."},
  {"name": "Ethical Skeptic", "stance": "AI-led education creates moral concerns."}
]
```

### 3. 人格AIの動的生成
- 視点情報からsystem promptを生成し、個別のGPTエージェントとして発言させる
- system prompt例:
```text
You are a professor known as the "Techno-Optimist". You believe AI will democratize and enhance global education. Respond to user topics from this stance.
```

### 4. 自動論語開始
- 人格AIたちがユーザーのテーマに対して、3~5ターンの論語を自動生成
- 後に実装するAutoGenへの移行も可能

### 5. ユーザーの発言に対する再論語
- ユーザーが言語を入力すると、現在の人格AIたちが再度論語を繰り復する

### 6. (優先序中) 要約と知見サマリー
- 論語結結にMetaAIが要点を整理し、ユーザーの視点や思考型を簡易に描納

---

## 実装技術

### フロントエンド
- Next.js (App Router)
- Tailwind CSS

### バックエンド
- Go or Node.js (GPTプロンプト生成、AIロジック実行)

### AI
- OpenAI GPT-4
  - Meta AI: 視点分析用
  - Dynamic Persona AI: 論語用の複数GPT instance

### DB
- Supabase
  - Session、User、Persona、Threadのログ保存

### Auth
- Supabase Auth

### Hosting
- Frontend: Vercel
- Backend: Fly.io or Render

---

## 今後の拡張性のために
- 思考履歴をNotion/マークダウン形式で出力
- 人格を自分でカスタマイズ可能
- 思考型を分析してユーザーに推奨視点を提示

---

## サービスの要素をAIに指示する際の文面例

「ユーザーが投げた意見・問題に対して、その内容を解析し、異なる視点や信念を持つ3~5人の人格AIを動的に生成してください。各人格は「名前」と「思想スタンス」の構造で表現し、それぞれにGPTのSystem Promptを創出します。生成したAI達によるユーザーテーマに対する論語を開始してください。」