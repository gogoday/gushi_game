import { useEffect, useState, useRef } from 'react';
import lodash from 'lodash';
import './App.css';
import { getCookie, setCookie } from './util';
import classname from 'classnames';

const userId = getCookie('user-id');
if (!userId) {
  setCookie('user-id', `${Date.now()}-${Math.random()}`);
}

function App() {
  const [data, setData] = useState({"author":"元礎","paragraphs":["寺隔*潮去","採*過泉聲","林塘*半宿","風*夜深來"],"title":"逸句","wrongSort":["秋","藥","殘","雨"]});
  const [newQ, setNewQ] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  let oriData = useRef({});
  let selectWord = useRef([]);
  useEffect(() => {
    async function fetchData() {
      setShowLoading(true);
      const result = await fetch('https://hello-cloudbase-1gjrribi96ea328d-1251036730.ap-shanghai.app.tcloudbase.com/getwords', {
        method: 'post',
        body: JSON.stringify({
          userId: getCookie('user-id')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // console.log(result.json());
      return result.json();
    }
    fetchData().then((res) => {
      setShowLoading(false);
      const { ret, data } = res;
      if (ret === 0) {
        console.log(data);
        oriData.current = lodash.cloneDeep(data);
        setData(data);
      } else {
        alert('服务异常，请点击换一题目')
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
    const body = JSON.stringify({
      select: selectWord.current,
      userId: getCookie('user-id'),
      create_time: oriData.current.create_time,
    })
    console.log(selectWord.current);
    setShowLoading(true);
    fetch('https://hello-cloudbase-1gjrribi96ea328d-1251036730.ap-shanghai.app.tcloudbase.com/check', {
      method: 'post',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setShowLoading(false);
      console.log(data);
      const { ret } = data;
      if (ret === 4) {
        alert('答案错误，请重新选择')
      } else if (ret === 0) {
        alert('恭喜你，答案正确')
        setNewQ(!newQ);
      } else {
        alert('系统繁忙，请重试')
      }
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
          <button onClick={getData}>换一题</button>
        </div>
        
      </header>
      <div className={classname({
        "loading-bg": true,
        "show-flex": showLoading,
      })}>
        <div className="loading">LOADING ....</div>
      </div>
    </div>
  );
}

export default App;
