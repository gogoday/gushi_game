import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({"author":"元礎","paragraphs":["寺隔*潮去","採*過泉聲","林塘*半宿","風*夜深來"],"title":"逸句","wrongSort":["秋","藥","殘","雨"]});

  useEffect(() => {
    async function fetchData() {
      const result = await fetch('https://hello-cloudbase-1gjrribi96ea328d-1251036730.ap-shanghai.app.tcloudbase.com/getwords')
      // console.log(result.json());
      return result.json();
    }
    fetchData().then((res) => {
      const { ret, data } = res;
      if (ret === 0) {
        console.log(data);
        setData(data);
      }
    })
  })
  return (
    <div className="App">
      <header className="App-header">
        <h3>填古诗</h3>
        <div className="title">{data.title}</div>
        <div className="author">作者：{data.author}</div>
        <div className="content">
        {
          data.paragraphs && data.paragraphs.map((item, index) => {
            return (
              <div key={index}>{item}</div>
            )
          })
        }
        </div>
        {
          data.wrongSort && data.wrongSort.map((item, index) => {
            return (
              <div key={index}>{item}</div>
            )
          })
        }
        
      </header>
    </div>
  );
}

export default App;
