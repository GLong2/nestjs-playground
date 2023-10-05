export function combHelloHtml(userName: string) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>환영합니다!</title>
          <style>
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }

              body {
                font-family: 'Arial', sans-serif;
                background-color: #f9f9f9;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;    
              }

              .welcome-message {
                background-color: #ffffff;
                padding: 30px; 
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                font-size: 48px;
                animation: fadeIn 1s ease-out forwards;
              }
          </style>
      </head>
      <body>
          <div class="welcome-message">
              ${userName}님 환영합니다.<br>hong-ground 웹 서비스를<br>준비중입니다.
              <a href="/auth/logout">Kakao Logout</a>
          </div>
      </body>
      </html>
    `;
}
