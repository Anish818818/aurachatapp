# AuraChat Phone Ekata Daganna Hati 📱

Meka machange phone ekata daganna lesima widiya thamai me thiyenne.

## Option 1: Local Network (Danma Balanna) ⚡
Meka thamai thama thiyena fast ma widiya.

1. **Host karanna**: PC eke project folder eka athule me command eka run karanna:
   ```bash
   npx serve ./
   ```
2. **IP eka hoyaganna**: Machange PC eke local IP address eka meka: `192.168.8.102`
3. **Phone eken open karanna**: Phone eke browser ekata (Safari/Chrome) gihin me link eka type karanna:
   `http://192.168.8.102:3000` (Port eka wenas unoth command eke thiyena port eka danna).

> [!NOTE]
> PC ekai Phone ekai dekaama ekama Wi-Fi (Dialog router) ekata connect wela thiyenna ona.

---

## Option 2: GitHub Pages (Parmanent Link ekak) 🌍
Hama welema use karanna link ekak ona nam meka karanna.

1. **Repo ekak hadanna**: [GitHub](https://github.com/new) gihin `chatapp` name eken repository ekak hadanna.
2. **Code upload karanna**:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/chatapp.git
   git push -u origin main
   ```
3. **Pages Enable karanna**:
   - Repo eke **Settings** -> **Pages** gihin "Deploy from a branch" select karanna.
   - **main** branch eka select karala Save karanna.
4. **Live Link eka**: `https://YOUR_USERNAME.github.io/chatapp/` kiyana link eken phone eken open karanna puluwan.

---

## Pro Tip: Add to Home Screen 📲✨
Link eka phone eken open karahama:
- **iPhone**: **Share** icon eka click karala **"Add to Home Screen"** select karanna.
- **Android**: **Menu** (dots 3) click karala **"Add to Home Screen"** select karanna.

Mehema kalama mechara wela api hadapu app eka machange phone eke thiyenne real app ekak wagema thama! 😍📱🤴✨🏆
