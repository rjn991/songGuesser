import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from './GetPlaylist.module.css'

import { useSelector,useDispatch} from 'react-redux'
import {setQuesArray,setQuesCount,setMaxQues} from '../features/playlistSlice'
const GetPlaylist = () => {

  const item_array = useSelector((state) => state.playlist.playlistItem)
  const dispatch = useDispatch()
  const quesArray = useSelector((state) => state.playlist.quesArray)
  const maxQuesCount = useSelector((state) => state.playlist.maxQues)
  const quesCount =  useSelector((state)=>state.playlist.quesCount)
  const navigate = useNavigate();
  
  function generateRandomNumbers(arr_len) {
    let numbers = new Set();
    while (numbers.size < 4) {
      let randomNumber = Math.floor(Math.random() * arr_len);
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  }

  const getQuestion = () => {
    let ques_count = 0
    let item_array_copy = [...item_array];
    let question_array = [];
    while (item_array_copy.length > 3) {
      let random_index = generateRandomNumbers(item_array_copy.length);
      //   console.log(random_index);
      let q1 = item_array_copy[random_index[0]];
      let q2 = item_array_copy[random_index[1]];
      let q3 = item_array_copy[random_index[2]];
      let q4 = item_array_copy[random_index[3]];
      item_array_copy.splice(random_index[0], 1);
      //   console.log(q1.snippet.title);
      //   console.log(q2.snippet.title);
      //   console.log(q3.snippet.title);
      //   console.log(q4.snippet.title);

      let temp_ans_array = [q1, q2, q3, q4];
      let temp_random_index = generateRandomNumbers(temp_ans_array.length);

      let temp = {
        question: q1.snippet.title,
        id: q1.snippet.resourceId.videoId,
        answers: [
          {
            title: temp_ans_array[temp_random_index[0]].snippet.title,
            id: temp_ans_array[temp_random_index[0]].snippet.resourceId.videoId,
          },
          {
            title: temp_ans_array[temp_random_index[1]].snippet.title,
            id: temp_ans_array[temp_random_index[1]].snippet.resourceId.videoId,
          },
          {
            title: temp_ans_array[temp_random_index[2]].snippet.title,
            id: temp_ans_array[temp_random_index[2]].snippet.resourceId.videoId,
          },
          {
            title: temp_ans_array[temp_random_index[3]].snippet.title,
            id: temp_ans_array[temp_random_index[3]].snippet.resourceId.videoId,
          },
        ],
      };
      question_array.push(temp);
      ques_count+=1
      
    }
    dispatch(setQuesArray(question_array));
    dispatch(setMaxQues(ques_count));
    // console.log(question_array);
    // console.log(ques_count);
  };

  const startGame = () => {
    if(quesCount>0 && quesCount<=maxQuesCount) {
        navigate("/question");
    }
  }

  useEffect(()=>{
    getQuestion()
  },[item_array])


  
  return (
    <div>
      <p>Enter the number of questions <br></br>(Maximum {maxQuesCount}): </p>
      <br></br>
      <input className={classes.numberArea} type="number" autoFocus onChange={(e)=> {dispatch(setQuesCount(e.target.value))}}></input>
      <br></br><br></br>
      <input className={classes.startButton} type="button" value="Start" onClick={startGame}></input>
      {/* {quesArray &&
        quesArray.map((q, pos) => {
          return (
            <div key={q.id}>
              <p>
                {pos + 1}. {q.question}
              </p>
              <p>----{q.answers[0].title}</p>
              <p>----{q.answers[1].title}</p>
              <p>----{q.answers[2].title}</p>
              <p>----{q.answers[3].title}</p>
              <br></br>
            </div>
          );
        })} */}
    </div>
  );
};

export default GetPlaylist;
