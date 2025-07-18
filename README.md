# Frontend Mini Mercado

Este é o frontend do projeto Mini Mercado, desenvolvido em React + Vite para a disciplina de Técnicas de Programação em Plataformas Emergentes (TPPE).

## Tecnologias Utilizadas
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Axios](https://axios-http.com/)
- [ESLint](https://eslint.org/)
- [Selenium](https://www.selenium.dev/)

## 🌐 Deploy
Acesse o frontend em produção:

👉 [https://frontend-mini-mercado.vercel.app](https://frontend-mini-mercado.vercel.app)

## 🎨 Protótipo Figma
Veja o design do sistema:

👉 [Protótipo no Figma](https://www.figma.com/design/P7Iw6NzhkGvnL3Vu72kfgO/Mini-Mercado---TPPE?node-id=0-1&t=sjhqkpkcfMfer1Qw-1)

## 📦 Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse [http://localhost:5173](http://localhost:5173)

## 🐳 Docker
Para rodar via Docker:

```bash
docker compose up --build frontend
```

## 🧪 Testes automatizados
- Testes de interface estão em `tests/selenium/` e podem ser rodados via Docker ou localmente.

## 📁 Estrutura de pastas
- `src/` - Código-fonte React
- `public/` - Assets estáticos
- `tests/` - Testes automatizados (Selenium, Playwright)

## 🔗 Backend
O backend está disponível em: [https://github.com/Carlos-kadu/Backend-Mini-Mercado](https://github.com/Carlos-kadu/Backend-Mini-Mercado)
