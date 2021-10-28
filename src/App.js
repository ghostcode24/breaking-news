import React, { useState, useEffect } from "react";
import alanBtn from '@alan-ai/alan-sdk-web';
import { Typography } from '@material-ui/core';

import wordsToNumbers from "words-to-numbers";

import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from './styles.js';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { red } from "@material-ui/core/colors";

const App = () => {
  const [newsArticles, setNewsArticles ] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_ALAN_API_KEY,
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'highlight'){
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
          const article = articles[parsedNumber -1];

          if (parsedNumber > 20) {
            alanBtn().playText('Please try again.')
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening ...');
          }

          
        }
      }
    })
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        <LiveTvIcon className={classes.logo} sx={{ fontSize: 38, color: red[900] }}  />
        <Typography className={classes.logoText} variant="h4">Breaking News</Typography>
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}

export default App;