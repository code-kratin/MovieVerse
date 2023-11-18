import React, { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";

export const API_KEY = "a9118a3a";
/*
https://www.omdbapi.com/?s=john%20wick&apikey=a9118a3a
{"Search":[
  {"Title":"John Wick",
  "Year":"2014","imdbID":"tt2911666",
  "Type":"movie",
  "Poster":"https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX300.jpg"
  },
  {"Title":"John Wick: Chapter 2","Year":"2017","imdbID":"tt4425200","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjE2NDkxNTY2M15BMl5BanBnXkFtZTgwMDc2NzE0MTI@._V1_SX300.jpg"},{"Title":"John Wick: Chapter 3 - Parabellum","Year":"2019","imdbID":"tt6146586","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMDg2YzI0ODctYjliMy00NTU0LTkxODYtYTNkNjQwMzVmOTcxXkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SX300.jpg"},{"Title":"John Wick: Chapter 4","Year":"2023","imdbID":"tt10366206","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMDExZGMyOTMtMDgyYi00NGIwLWJhMTEtOTdkZGFjNmZiMTEwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_SX300.jpg"},{"Title":"John Wick: Chapter 3 - Parabellum: HBO First Look","Year":"2019","imdbID":"tt10275370","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BYmI2NTIzNWYtYjVkNi00ZmRkLTlkYmUtZTU5YjVjNDMzMTdkXkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg"},{"Title":"The Continental: From the World of John Wick","Year":"2023","imdbID":"tt6486762","Type":"series","Poster":"https://m.media-amazon.com/images/M/MV5BZDk1MmI3YWEtMGE0MS00ZjFlLWIxMjgtMjc5MmRjOTZiMDc2XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg"},{"Title":"John Wick Chapter 2: Wick-vizzed","Year":"2017","imdbID":"tt7161870","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BM2I0YWM3Y2EtYzU1YS00MWE1LTg0YjUtNWQ2YTBjZWQ5Mzc1XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg"},{"Title":"John Wick: Don't F*#% with John Wick","Year":"2015","imdbID":"tt5278630","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjQ2YzgxNDUtMmM1NS00MzI1LWI1NjYtZjUyYjBhZjQ5MDdmXkEyXkFqcGdeQXVyODA1NjQ0OTY@._V1_SX300.jpg"},{"Title":"John Wick: Kill Count","Year":"2017","imdbID":"tt7161942","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjcyM2UzMGQtYzkzYy00MGQ3LWE0MTAtNjIzNzk5MTBhNGQ3XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg"},{"Title":"John Wick: The Assassin's Code","Year":"2015","imdbID":"tt5278698","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BZmQyNDM5OWEtMTliMS00MDIzLWJlZDAtZDYwNTg2YzJkNzFlXkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg"}],"totalResults":"38","Response":"True"}
*/
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");

  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const [timeoutId, updateTimeoutId] = useState();

  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`,
    );
    updateMovieList(response.data.Search);
  };

  const onTextChange = (e) => {
    onMovieSelect(""); //to close the detail tab if open upon changing the search
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
    //or either make a search button which will call the fetchData function
    //without timeout, with each character entered the function will be called, we want to wait 0.5 sec after each character entered
    //i.e, each change to see if there is no change we will call the function otherwise not.
  };
  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0w13a7QAsIfo7XEV80Es3JUaFnANQ7RsNzw&usqp=CAU" />
          MovieVerse
        </AppName>
        <SearchBox>
          <SearchIcon src="/react-movie-app/search-icon.svg" />
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      {selectedMovie && <MovieInfoComponent selectedMovie={selectedMovie} onMovieSelect={onMovieSelect}/>}
      {/* will show the movie detail only if selectedMovie value is not null */}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="https://t3.ftcdn.net/jpg/04/64/78/74/360_F_464787423_mFNIhM8f00HagGgI2eGzsf3wevZhPHCC.jpg" />
        )}
      </MovieListContainer>
    </Container>
  );
}

export default App;