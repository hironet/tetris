<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
  <title>テトリス</title>
  <style>
    html {
      overflow: hidden;  /* スクロールを禁止 */
      touch-action: manipulation;
    }

    .ope-button {
      border-radius: 4px;
      border-style: none;
      color: white;
      margin: 5px 5px;
      padding: 0.8em 0.2em;
      position: relative;
      width: 70px;
    }

    #left-btn {
      background-color: #1e90ff;
    }

    #under-btn {
      background-color: #32cd32;
    }

    #right-btn {
      background-color: #ff69b4;
    }

    #rotate-btn {
      background-color: #ff8c00;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-12 col-lg-auto">
        <canvas id="can"></canvas>
      </div>
      <div class="col-auto col-lg-auto">
        <div class="btn-group" role="group">
          <button id="left-btn" class="ope-button" type="button">左</button>
          <button id="under-btn" class="ope-button" type="button">下</button>
          <button id="rotate-btn" class="ope-button" type="button">回転</button>
          <button id="right-btn" class="ope-button" type="button">右</button>
        </div>
      </div>
    </div>
  </div>
  <script src="tetris.js"></script>
</body>
</html>
