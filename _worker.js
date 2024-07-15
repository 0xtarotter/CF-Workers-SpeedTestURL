export default {
  async fetch(request) {
    // 创建一个新的 URL 对象
    let url = new URL(request.url);
    let path = url.pathname.substring(1);
    let isSecure = url.protocol.startsWith("https");
    let bytes;
    // 判断路径是否为空
    if (!path) {
      // 路径为空，将 bytes 赋值为 200MB
      bytes = 200000000;
    } else if (path === "locations") {
      let targetUrl = `http${isSecure ? 's' : ''}://speed.cloudflare.com/locations`;
      let cfRequest = new Request(targetUrl, request);
      let response = await fetch(cfRequest);
      return response;
    } else {
      // 其他路径，进行正常的处理
      const regex = /^(\d+)([a-z]?)$/i;
      const match = path.match(regex);
      if (!match) {
        // 路径格式不正确，返回错误
        return new Response("路径格式不正确", {
          status: 400,
        });
      } else if (url.pathname == "/"){//首页改成一个nginx伪装页
			return new Response(`
			<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> </title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        }
        .container {
            text-align: center;
        }
        h1 {
            color: #ff6347;
            font-size: 2.5em;
        }
        p {
            color: #333;
            font-size: 1.2em;
        }
        .error-code {
            font-size: 4em;
            margin: 20px 0;
            color: #ff6347;
        }
        a {
            text-decoration: none;
            color: #fff;
            background-color: #ff6347;
            padding: 10px 20px;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        a:hover {
            background-color: #e0533c;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>URL参数不正确</h1>
        <p>请求API时出现了一个错误。</p>
        <div class="error-code">error</div>
        <p>Exmple -> https://exmple.com/yourtoken</p>
        <a href="https://tiao.ma">返回所有者页面</a>
    </div>
</body>
</html>

			`,

      const bytesStr = match[1];
      const unit = match[2].toLowerCase();

      // 转换单位
      bytes = parseInt(bytesStr, 10);
      if (unit === "k") {
        bytes *= 1000;
      } else if (unit === "m") {
        bytes *= 1000000;
      } else if (unit === "g") {
        bytes *= 1000000000;
      }
    }

    let targetUrl = `http${isSecure ? 's' : ''}://speed.cloudflare.com/__down?bytes=${bytes}`;
    let cfRequest = new Request(targetUrl, request);
    let response = await fetch(cfRequest);

    // 将测试结果反馈给用户
    return response;
  }
};
