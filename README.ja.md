# 🎲 KUJIKUJI - インタラクティブ3D抽選

**KUJI (くじ)** は日本語で「抽選」や「くじ引き」を意味します。アニメーションロボットキャラクター、映画的効果、スムーズな遷移を特徴とするインタラクティブ3D抽選アプリケーションです。

🎮 **[ライブデモ](https://siriz.github.io/kujikuji/)** | 📖 **他の言語で読む**: [English](README.md) | [한국어](README.ko.md)

![コンセプト画像](kuji_concept.png)
*Google Gemini (Nano Banana)で生成されたコンセプト画像*

![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ 主な機能

- 🎭 **3Dアニメーションキャラクター** - ランダムアニメーション付きインタラクティブロボットモデル
- 🎲 **ランダム抽選システム** - 劇的な演出を伴う公平な抽選
- ✨ **パーティクルエフェクト** - ゴールドの爆発、きらめき、花火の祝賀効果
- 📸 **ユニークなアバター** - DiceBear統合により各キャラクターにユニークなアバター
- 💾 **自動保存** - LocalStorageによる進行状況の自動保存
- 📱 **レスポンシブデザイン** - デスクトップとモバイルの両方に対応
- 🎬 **シネマティック遷移** - スムーズなカメラ移動と照明効果
- 📊 **進行状況追跡** - リアルタイム統計表示
- 🌐 **多言語サポート** - 英語、日本語、韓国語(한국어)対応およびURLパラメータサポート

## 🌐 言語サポート

KUJIKUJIは自動検出と保存機能を備えた3つの言語をサポートしています:

### サポート言語

- 🇺🇸 **英語(English)** (デフォルト)
- 🇯🇵 **日本語**
- 🇰🇷 **韓国語(한국어)**

### 言語変更方法

#### 方法1: 言語セレクターを使用

画面右上の言語ドロップダウン(🌐)をクリックして、お好みの言語を選択してください。選択した言語はlocalStorageに自動的に保存されます。

#### 方法2: URLパラメータを使用

URLパラメータを使用して直接言語を設定できます:

```
# 英語
http://localhost:8000/index.html?lang=en

# 日本語
http://localhost:8000/index.html?lang=ja

# 韓国語
http://localhost:8000/index.html?lang=ko
```

この方法は`index.html`と`select.html`の両方のページで機能します。

### 翻訳範囲

すべてのUI要素が完全に翻訳されています:
- ページタイトルとヘッダー
- 入力方法のタブとラベル
- ボタンとアクション
- 統計と進行状況表示
- 通知メッセージ
- 確認ダイアログ

### 実装の詳細

- **翻訳ファイル**: `locales/translations.json` - JSONベースの翻訳システム
- **i18nモジュール**: `js/i18n.js` - 言語の読み込み、切り替え、DOM更新を処理
- **保存**: 言語設定はlocalStorageに`preferredLanguage`として保存されます
- **動的更新**: 言語変更時にすべてのテキストコンテンツが即座に更新されます
- **属性**: 自動翻訳のために`data-i18n`および`data-i18n-placeholder`属性を使用

## 🎮 使い方

### ステップ1: キャラクター追加 (`index.html`)

![キャラクター入力画面](kuji_list.png)

3つの入力方法から1つを選択してください:

1. **数字で生成**: 1〜50の数字を入力して「User 1」、「User 2」などの名前でキャラクターを自動生成
2. **テキスト貼り付け**: Excelまたはテキストファイルから名前をコピーして貼り付け（1行に1つ）
3. **手動追加**: 「+ 追加」ボタンをクリックしてキャラクターを1つずつ追加

各キャラクターはDiceBearから提供されるユニークなロボットアバターを受け取ります。開始する前に名前を編集したり、キャラクターを削除したりできます。

### ステップ2: 抽選開始 (`select.html`)

![抽選画面](kuji_play.png)

1. **「配置開始」**ボタンをクリックして3Dシーンに移動
2. キャラクターが円形パターンでランダムに配置されます
3. カメラがスムーズに降下してすべてのキャラクターを表示します
4. キャラクターがランダムアニメーションを実行する様子を観察

### ステップ3: 選択する

![選択されたキャラクター画面](kuji_selected.png)

1. **「GO」**ボタンをクリックしてランダムにキャラクターを選択
2. 劇的な演出を楽しむ:
   - 背景が暗くなる
   - スポットライトが当選者に集中
   - パーティクルエフェクトの爆発
   - キャラクターが感情表現を実行
   - 名前カードがひっくり返って身元が明らかに

3. **「RETURN」**ボタンをクリックして全体ビューに戻る
4. すべてのキャラクターが選択されるまで繰り返す

### ステップ4: 完了

- 進行状況は左上で追跡されます
- すべてのキャラクターが選択されると、再起動するかどうかを尋ねるメッセージが表示されます
- すべてのデータはセッション間でlocalStorageに保持されます

## 🚀 はじめに

### 前提条件

- WebGLをサポートする最新のWebブラウザ
- LocalStorageが有効
- ローカルWebサーバー（または以下の方法を使用）

### インストール方法

1. リポジトリをクローン:
```bash
git clone https://github.com/siriz/kujikuji.git
cd kujikuji
```

2. ローカルWebサーバーを使用してファイルを提供:

**方法1: Pythonを使用**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**方法2: Node.jsを使用**
```bash
npx http-server
```

**方法3: VS Codeを使用**
- 「Live Server」拡張機能をインストール
- `index.html`を右クリックして「Open with Live Server」を選択

3. ブラウザを開いて次のアドレスに移動:
```
http://localhost:8000
```

## 📁 プロジェクト構造

```
kujikuji/
├── index.html          # キャラクター入力画面（エントリーポイント）
├── select.html         # メイン3D抽選選択シーン
├── test/
│   └── robot.html     # アバター位置調整デバッグツール
├── css/
│   ├── main.css                # グローバルスタイルシート
│   ├── select.css              # 選択ページ専用スタイル
│   └── language-selector.css   # 言語セレクタードロップダウンスタイル
├── js/
│   ├── main.js        # メイン3Dシーンロジック
│   ├── storage.js     # LocalStorageデータ管理
│   ├── utils.js       # ユーティリティ関数（位置指定、衝突検出）
│   ├── particles.js   # パーティクルエフェクトシステム
│   └── i18n.js        # 国際化システム
├── locales/
│   └── translations.json       # 多言語翻訳 (en/ja/ko)
├── libs/
│   ├── gsap/
│   │   └── gsap.min.js    # GSAPアニメーションライブラリ（ローカル）
│   └── threejs/       # Three.jsライブラリファイル
│       ├── build/
│       │   └── three.module.js
│       └── jsm/       # Three.jsアドオンとユーティリティ
│           ├── controls/      # OrbitControls
│           ├── loaders/       # GLTFLoader, FontLoader
│           ├── geometries/    # TextGeometry
│           └── libs/          # Stats, GUI
│   ├── models/        # 3Dモデルファイル
│   │   └── gltf/
│   │       └── RobotExpressive/
│   └── fonts/         # 3Dテキスト用フォントファイル
│       └── optimer_bold.typeface.json
```

## 🛠️ 使用技術

- **Three.js** - 3Dグラフィックスライブラリ
- **GSAP** - アニメーションライブラリ
- **DiceBear API** - アバター生成
- **WebGL** - ハードウェアアクセラレーション3Dレンダリング
- **LocalStorage** - クライアント側データ永続化
- **i18n System** - JSONベース国際化 (en/ja/ko)

*詳細なサードパーティライブラリ情報とライセンスについては、以下の[ライセンス](#-ライセンス)セクションを参照してください。*

## 🔧 開発とデバッグ

### アバター位置調整ツール

ロボットアバターの位置を調整したい開発者のために、デバッグツールを提供しています:

**場所**: `test/robot.html`

**機能**:
- リアルタイムアバター位置調整（X、Y、Z 0.001精度）
- 回転コントロール（X、Y、Z 0.1°精度）
- 50段階のアンドゥ/リドゥシステム
- Head_3ボーンのビジュアルワイヤーフレームヘルパー
- 即座のフィードバックを伴うインタラクティブコントロール

**使用方法**:
```bash
# ローカルサーバーを起動（まだ実行していない場合）
python -m http.server 8000

# ブラウザで開く
http://localhost:8000/test/robot.html
```

スライダーと入力フィールドを使用してアバタープレーンの位置と回転を微調整してください。変更はボタンまたはキーボードショートカット（Ctrl+Z / Ctrl+Y）を使用して元に戻す/やり直すことができます。

## 🎨 カスタマイズ

### 独自のキャラクター名を追加

1. `index.html`を開く
2. 3つの入力方法のいずれかを使用
3. キャラクターは自動的にlocalStorageに保存されます

### 視覚効果の調整

`js/particles.js`を編集してパーティクルエフェクトをカスタマイズできます。利用可能なエフェクト:

#### 1. **紙吹雪バースト** 🎊 (NEW!)
中央から花火のように爆発するカラフルな紙吹雪:
```javascript
ParticleEffects.createConfettiBurst(scene, position, {
    particleCount: 150,
    explosionForce: 0.4,
    duration: 4.5
});
```

#### 2. **紙吹雪レイン** 🌧️ (NEW!)
空からふわふわと揺れながら落ちる紙吹雪:
```javascript
ParticleEffects.createConfettiRain(scene, camera, {
    particleCount: 120,
    duration: 6,
    fallSpeed: 0.025
});
```

#### 3. **フルセレブレーション** 🎉 (NEW!)
バースト + レインの組み合わせで最高のお祝い演出:
```javascript
ParticleEffects.createConfettiCelebration(scene, position, camera);
```

#### 4. **選択エフェクト** ✨
螺旋運動の黄金のパーティクル:
```javascript
ParticleEffects.createSelectionEffect(scene, position, {
    particleCount: 100,  // より多くのパーティクル
    color: 0xFF0000,     // 赤いパーティクル
    duration: 3          // より長いアニメーション
});
```

#### 5. **花火エフェクト** 🎆
重力が作用する爆発パーティクル:
```javascript
ParticleEffects.createFireworkEffect(scene, position, {
    particleCount: 120,
    explosionForce: 0.3
});
```

### 新しい紙吹雪エフェクトのテスト

すべての紙吹雪エフェクトをテストできる専用デモページが用意されています:

**場所**: `test/confetti-demo.html`

**機能**:
- 💥 **紙吹雪バースト**: 花火スタイルの爆発
- 🌧️ **紙吹雪レイン**: 優しい落下動作
- 🎊 **フルセレブレーション**: バースト + レインの組み合わせ
- ✨ **クラシックエフェクト**: 従来のパーティクルシステム

**使用方法**:
```bash
# ブラウザで開く
http://localhost:8000/test/confetti-demo.html
```

カラフルなボタンをクリックして様々なエフェクトを発動させてください。複数回クリックしてエフェクトを重ねると、より華やかなお祝い演出が可能です！


### 位置指定アルゴリズムの変更

`js/utils.js` → `generatePositions()`を修正:
- 間隔のための`minDistance`を調整
- レイヤー間隔を変更
- 円形/螺旋パターンを修正

## 📊 データ管理

### LocalStorage構造

```json
{
  "characters": [
    {
      "id": "unique-id",
      "name": "Character Name",
      "avatarSeed": "random-seed",
      "selected": false,
      "selectedAt": null,
      "createdAt": "2025-10-26T..."
    }
  ],
  "selectedCharacters": [],
  "createdAt": "2025-10-26T...",
  "updatedAt": "2025-10-26T..."
}
```

### データ操作

- **エクスポート**: 「データ出力」ボタンをクリックしてJSONバックアップをダウンロード
- **リセット**: すべてのデータを削除して新規開始
- **永続化**: 各操作後にデータが自動保存されます

## 🎭 アニメーション状態

ロボットは様々なアニメーション状態をサポートしています:

- **状態**: Idle, Walking, Running, Dance, Sitting, Standing, Death
- **感情表現**: Jump, Yes, No, Wave, Punch, ThumbsUp

選択されていないキャラクターはこれらのアニメーションをランダムに実行します。

## 📱 ブラウザ互換性

- Chrome（推奨）
- Firefox
- Safari
- Edge
- Opera

**注意**: WebGLサポートが必要です。一部の古いブラウザやデバイスは互換性がない場合があります。

## 🤝 貢献

貢献を歓迎します！お気軽に:

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. Pull Requestを開く

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細については[LICENSE](LICENSE)ファイルを参照してください。

### サードパーティライセンス

このプロジェクトは以下の外部ライブラリとアセットを使用しており、それぞれ独自のライセンスを持っています:

#### Three.js (MIT License)
- **場所**: `libs/threejs/`
- **ライセンス**: MIT License
- **URL**: https://threejs.org/
- **著作権**: Copyright © 2010-2024 Three.js authors

#### GSAP (GreenSock Animation Platform)
- **場所**: `libs/gsap/`
- **ライセンス**: GreenSock Standard License（ほとんどのユースケースで無料）
- **URL**: https://greensock.com/licensing/
- **注意**: 商用プロジェクトはライセンスが必要な場合があります

#### RobotExpressive 3D Model
- **場所**: `libs/models/gltf/RobotExpressive/`
- **ソース**: Three.js Examples
- **ライセンス**: MIT License（Three.js examplesの一部として）
- **URL**: https://github.com/mrdoob/three.js/tree/master/examples/models/gltf

#### MgOpen Fonts (Optimer, Helvetiker)
- **場所**: `libs/fonts/`
- **ライセンス**: MgOpen License（商用および非商用使用無料）
- **URL**: http://www.ellak.gr/fonts/MgOpen/
- **著作権**: Copyright (c) 2004 by MAGENTA Ltd.
- **注意**: 使用、コピー、統合、公開、配布が自由

#### DiceBear Avatars API
- **サービス**: アバター生成（外部API）
- **ライセンス**: 個人および商用使用無料
- **URL**: https://www.dicebear.com/
- **使用スタイル**: bottts-neutral

すべてのサードパーティコンポーネントは元のライセンスを保持します。完全なライセンステキストについては、`libs/`ディレクトリ内のそれぞれのライセンスファイルを参照してください。

## 🙏 謝辞

- 素晴らしい3Dライブラリと例を提供してくれたThree.jsチーム
- スムーズなアニメーションフレームワークを提供してくれたGSAPチーム
- Three.js examplesのロボットモデル（RobotExpressive）
- 美しい書体を提供してくれたMgOpen Fontsプロジェクト
- アバター生成APIを提供してくれたDiceBear

## 📧 連絡先

siriz - [@siriz](https://github.com/siriz)

プロジェクトリンク: [https://github.com/siriz/kujikuji](https://github.com/siriz/kujikuji)

---

Made with ❤️ and Three.js
