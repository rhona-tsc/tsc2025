use('tsc2025');

db.acts.updateOne(
    { _id: ObjectId("68540004e47bb51c79b9202e") },
  {
    $push: {
        selectedSongs: {
          $each: 
          [
            {
              "title": "(Sittin' On) The Dock Of The Bay",
              "artist": "Otis Redding",
              "year": 1968,
              "genre": "Soul"
            },
            {
              "title": "(You Make Me Feel Like) A Natural Woman",
              "artist": "Aretha Franklin",
              "year": 1967,
              "genre": "Soul / R&B"
            },
            {
              "title": "(Your Love Keeps Lifting Me) Higher And Higher",
              "artist": "Jackie Wilson",
              "year": 1967,
              "genre": "Soul / R&B"
            },
            {
              "title": "A Change Is Gonna Come",
              "artist": "Sam Cooke",
              "year": 1964,
              "genre": "Soul / Gospel"
            },
            {
              "title": "Ain't No Sunshine",
              "artist": "Bill Withers",
              "year": 1971,
              "genre": "Soul / R&B"
            },
            {
              "title": "Ain’t No Mountain High Enough",
              "artist": "Marvin Gaye & Tammi Terrell",
              "year": 1967,
              "genre": "Motown / Soul"
            },
            {
              "title": "Ain’t Nobody",
              "artist": "Chaka Khan",
              "year": 1983,
              "genre": "R&B / Funk"
            },
            {
              "title": "As",
              "artist": "Stevie Wonder",
              "year": 1976,
              "genre": "Soul / R&B"
            },
            {
              "title": "At Last",
              "artist": "Etta James",
              "year": 1960,
              "genre": "Blues / Soul"
            },
            {
              "title": "Baby Give It Up",
              "artist": "KC & The Sunshine Band",
              "year": 1983,
              "genre": "Disco / Funk"
            },
            {
              "title": "Best Of My Love",
              "artist": "The Emotions",
              "year": 1977,
              "genre": "Disco / R&B"
            },
            {
              "title": "Can't Hurry Love",
              "artist": "The Supremes",
              "year": 1966,
              "genre": "Motown / Pop Soul"
            },
            {
              "title": "Easy",
              "artist": "The Commodores",
              "year": 1977,
              "genre": "Soul / Soft Rock"
            },
            {
              "title": "For Once In My Life",
              "artist": "Stevie Wonder",
              "year": 1968,
              "genre": "Soul / Motown"
            },
            {
              "title": "Give Me The Night",
              "artist": "George Benson",
              "year": 1980,
              "genre": "Jazz / Funk / R&B"
            },
            {
              "title": "How Sweet It Is To Be Loved By You",
              "artist": "Marvin Gaye",
              "year": 1964,
              "genre": "Soul / Motown"
            },
            {
              "title": "I Heard It Through The Grapevine",
              "artist": "Marvin Gaye",
              "year": 1968,
              "genre": "Soul / Motown"
            },
            {
              "title": "I Say A Little Prayer",
              "artist": "Aretha Franklin",
              "year": 1968,
              "genre": "Soul / Pop"
            },
            {
              "title": "I Wish",
              "artist": "Stevie Wonder",
              "year": 1976,
              "genre": "Funk / Soul"
            },
            {
              "title": "In The Midnight Hour",
              "artist": "Wilson Pickett",
              "year": 1965,
              "genre": "R&B / Soul"
            },
            {
              "title": "Isn't She Lovely",
              "artist": "Stevie Wonder",
              "year": 1976,
              "genre": "Soul / Pop"
            },
            {
              "title": "Just The Two Of Us",
              "artist": "Bill Withers",
              "year": 1981,
              "genre": "Soul / R&B"
            },
            {
              "title": "Killing Me Softly",
              "artist": "Roberta Flack",
              "year": 1973,
              "genre": "Soul / R&B"
            },
            {
              "title": "Lean On Me",
              "artist": "Bill Withers",
              "year": 1972,
              "genre": "Soul / Gospel"
            },
            {
              "title": "Lovely Day",
              "artist": "Bill Withers",
              "year": 1977,
              "genre": "Soul / R&B"
            },
            {
              "title": "Me & Mrs Jones",
              "artist": "Billy Paul",
              "year": 1972,
              "genre": "Soul / R&B"
            },
            {
              "title": "Move On Up",
              "artist": "Curtis Mayfield",
              "year": 1970,
              "genre": "Funk / Soul"
            }
          ]
      
    }
    }
  }
);