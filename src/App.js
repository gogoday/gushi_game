import { useEffect, useState, useRef } from 'react';
import lodash from 'lodash';
import './App.css';

function App() {
  const [data, setData] = useState({"author":"元礎","paragraphs":["寺隔*潮去","採*過泉聲","林塘*半宿","風*夜深來"],"title":"逸句","wrongSort":["秋","藥","殘","雨"]});
  const [newQ, setNewQ] = useState(false);
  let oriData = useRef({});
  let selectWord = useRef([]);
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
        oriData.current = lodash.cloneDeep(data);
        setData(data);
      }
    })
  }, [newQ])

  const select = (word) => {
    selectWord.current.push(word)
    console.log(word);
    const cloneData = JSON.parse(JSON.stringify(data));
    for (let i = 0, l = cloneData.paragraphs.length; i < l; i++) {
      const item = cloneData.paragraphs[i];
      if (item.indexOf('*') >= 0) {
        cloneData.paragraphs[i] = item.replace('*', word);
        cloneData.wrongSort = cloneData.wrongSort.filter(wordItem => wordItem !== word);
        break;
      }
    }
    setData(cloneData);
  }

  const reset = () => {
    console.log('reset ..')
    console.log(oriData.current)
    setData(oriData.current);
    selectWord.current = [];
  }

  const submit = () => {
    if (selectWord.current.length === 0) {
      alert('未答题')
      return;
    }
    console.log(selectWord.current);
    fetch('https://hello-cloudbase-1gjrribi96ea328d-1251036730.ap-shanghai.app.tcloudbase.com/check', {
      method: 'post',
      body: JSON.stringify(selectWord.current),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
  }
  const getData = () => {
    setNewQ(!newQ);
    selectWord.current = [];
  }
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
        <div className="tips"> 按顺序点击下面的字自动填入上面古诗中*的位置，使古诗正确 </div>
        <div className="words">
          
        {
          data.wrongSort && data.wrongSort.map((item, index) => {
            return (
              <div key={index} onClick={e => {select(item)}}>{item}</div>
            )
          })
        }
        </div>
        
        <div className="op">
          <button onClick={reset}>重新选择</button>
          <button onClick={submit}>提交答案</button>
          <button onClick={getData}>换一提</button>
        </div>
        
      </header>
    </div>
  );
}

export default App;
