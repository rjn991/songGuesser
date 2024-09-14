import axios from "axios";
import Header from "./Header/Header";
import GetPlaylist from "./GetPlaylist/GetPlaylist";
import Footer from "./Footer/Footer";
import { useEffect, useState } from "react";
import classes from "./App.module.css";

function App() {
  const api = import.meta.env.VITE_YT_KEY;
  const [answer, setAnswer] = useState();
  const [data, setData] = useState();
  const [item_array, setItem_array] = useState();
  const [div1status, setDiv1Status] = useState(true);
  const getQueryParams = (url) => {
    let params = {};
    let parser = new URL(url);
    let query = parser.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  const fetch_vid = async () => {
    const param = getQueryParams(answer);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${param.list}&key=${api}&part=snippet&maxResults=50`
      );
      setData(response.data);
      setItem_array(response.data.items);
      setDiv1Status(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.appwrapper}>
      <Header></Header>
      <div className={classes.inputWrapper}>
        {div1status &&
          (() => {
            return (
              <div>
                <p>Paste any youtube playlist URL</p>
                <input
                  className={classes.linkarea}
                  type="textbox"
                  onChange={(e) => {
                    setAnswer(e.target.value);
                  }}
                ></input>
                <br></br>
                <br></br>
                <input
                  className={classes.nextButton}
                  type="button"
                  value="Next"
                  onClick={fetch_vid}
                ></input>
                <br></br>
              </div>
            );
          })()}

        {data &&
          (() => {
            return <GetPlaylist data={data} item={item_array}></GetPlaylist>;
          })()}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
