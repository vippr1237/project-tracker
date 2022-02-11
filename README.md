# Mô tả

Trang web quản lý công việc cho phép người dùng tạo dự án, thêm thành viên, giao công việc cho thành viên và bình luận công việc. Sử dụng fullstack MERN (Javascript) và ứng dụng socket-io cho realtime<br>
Bài này làm gấp để chạy kịp deadline nộp bài nên code sẽ xấu và triền miên đặc biệt 1 số file
<br><br>
***Đã ứng dụng docker***

# Framework và libaries

-Nodejs https://nodejs.org/en/ </br>
-Express http://expressjs.com/ </br>
-MongoDB https://www.mongodb.com/ </br>
-Reactjs https://reactjs.org/ </br>
-Socket.io https://socket.io/docs/v4 </br>

# Setup

#### Init setup

For Windows: `./init.cmd`
<br>
For Linux: `. ./init.sh`
#### Install dependecies

cd `client` </br>
`npm install`</br>
cd `../` </br>
`npm install`</br>
</br>

#### Development

docker-compose up --build -d mongodb</br>
`npm run dev`</br>
