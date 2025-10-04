import axios from "axios";
import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const BandNameGenerator = () => {
  const [tscName, setTscName] = useState("");
  const [name] = useState("");
  const [suggestedName, setSuggestedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingNames, setExistingNames] = useState([]);
  const [actSize] = useState("3-piece, 4-piece, 5-piece, 6-piece"); // Default value

  // Fetch existing band names from your database
  useEffect(() => {
    const fetchExistingNames = async () => {
      try {
        const response = await axios.get("/api/act/names"); // Adjust API endpoint
        setExistingNames(response.data); // Assume response.data is an array of act names
      } catch (error) {
        console.error("Error fetching band names:", error);
      }
    };

    fetchExistingNames();
  }, []);

  const generateBandName = async () => {
    if (!name) {
      alert("Please enter a band name for inspiration.");
      return;
    }

    setLoading(true);

    // Ensure genre is a string
    const genre = []; // Define genre with a default empty array or appropriate value
    const genreString = Array.isArray(genre) ? genre.join(", ") : genre;

    // Safe fallback values
    const description = ""; // Define description with a default empty string or appropriate value
    const safeDescription =
      description ||
      "An electrifying party band delivering high-energy performances with a hit-packed setlist. Perfect for weddings, parties & events.";
    const bio = ""; // Define bio with a default empty string or appropriate value
    const safeBio =
      bio ||
      "A renowned party-starting band performing a repertoire of chart-topping party favorites, pop, rock, soul, Motown, dance, and funk.";
    const safeGenre = genreString || "pop, rock, rnb, soul";
    const repertoire = []; // Define repertoire with a default empty array or appropriate value
    const safeRepertoire = repertoire || [
      "Make You Feel My Love",
      "Rolling In The Deep",
      "Set Fire To The Rain",
      "Skyfall",
      "I'm Outta Love",
      "Complicated",
      "Everybody (Backstreet's Back)",
      "I Want It That Way",
      "I Gotta Feeling",
      "Oops!...I Did it Again",
      "24K Magic",
      "Grenade",
      "Just The Way You Are",
      "Lazy Song",
      "Locked Out Of Heaven",
      "Marry You",
      "Runaway Baby",
      "The Lazy Song",
      "Treasure",
      "When You're Gone",
      "How Deep Is Your Love",
      "Call Me Maybe",
      "Believe",
      "A Thousand Years",
      "Rather Be",
      "Get Lucky",
      "Cake by the Ocean",
      "Don’t Start Now",
      "Mercy",
      "Perfect",
      "Ghost",
      "You've Got The Love",
      "I'm Yours",
      "I'll Be There",
      "Domino",
      "Price Tag",
      "Bang Bang",
      "All Of Me",
      "Can't Stop The Feeling",
      "California Gurls",
      "Firework",
      "Roar",
      "Spinning Around",
      "Poker Face",
      "The Edge of Glory",
      "Black Magic",
      "Shout Out to My Ex",
      "Good As Hell",
      "Mambo Number 5",
      "Moving On Up",
      "Uptown Funk",
      "Moves Like Jagger",
      "Five Colours In Her Hair",
      "All About That Bass",
      "I'm Like A Bird",
      "Don't Know Why",
      "Dance With Me Tonight",
      "Troublemaker",
      "Cheerleader",
      "Counting Stars",
      "Get The Party Started",
      "Lady Marmalade",
      "What About Us?",
      "Mysterious Girl",
      "Happy",
      "Livin La Vida Loca",
      "Diamonds",
      "Don't Stop The Music",
      "Please Don't Stop The Music",
      "Umbrella",
      "We Found Love",
      "Let Me Entertain You",
      "Rock DJ",
      "Bring It All Back",
      "Don't Stop Movin'",
      "Reach",
      "Black & Gold",
      "Don't Feel Like Dancing",
      "Murder On The Dancefloor",
      "Relight My Fire",
      "Shake It Off",
      "Stop",
      "Wannabe",
    ];
    const customRepertoire = []; // Define customRepertoire with a default empty array or appropriate value
    const safeCustomRepertoire = customRepertoire || [
      "Shut Up And Dance",
      "Heaven Is a Place on Earth",
      "Young Hearts Run Free",
      "Girls Just Wanna Have Fun",
      "Let's Hear It For The Boy",
      "Que Sera Sera",
      "I'm Still Standing",
      "Sweet Dreams (Are Made of This)",
      "Over The Rainbow",
      "Everywhere",
      "Go Your Own Way",
      "Can't Take My Eyes Off You",
      "Faith",
      "But Not For Me",
      "Power Of Love",
      "Flashdance...What A Feeling",
      "Fame",
      "What Becomes Of The Broken Hearted",
      "Don't Stop Believing",
      "Walking On Sunshine",
      "Footloose",
      "Shout",
      "Material Girl",
      "Beat It",
      "Billie Jean",
      "Black Or White",
      "Man In The Mirror",
      "The Way You Make Me Feel",
      "Mrs Robinson",
      "A Hard Day's Night",
      "Hey Jude",
      "I Saw Her Standing There",
      "I Wanna Hold Your Hand",
      "Let It Be",
      "Twist And Shout",
      "Close To You",
      "We've Only Just Begun",
      "Build Me Up Buttercup",
      "I'll Be There",
      "I'm A Believer",
      "I'm So Excited",
      "Every Breath You Take",
      "It's Raining Men",
      "It's Not Unusual",
      "Dancing In The Moonlight",
      "Brown Eyed Girl",
      "Wake Me Up Before You Go-Go",
      "I Have Nothing",
      "I Wanna Dance with Somebody",
      "I'm Every Woman",
      "Saving All My Love for You",
      "Empire State Of Mind",
      "If I Ain't Got You",
      "Crazy In Love",
      "Love On Top",
      "Single Ladies",
      "Forget You",
      "Bootylicious",
      "Survivor",
      "American Boy",
      "Crazy",
      "Beggin",
      "Hero",
      "Valerie",
      "Hey Ya",
      "Ignition",
      "How Will I Know",
      "A Natural Woman",
      "I Say A Little Prayer",
      "Respect",
      "Think",
      "Stand By Me",
      "Ain't No Sunshine",
      "Lovely Day",
      "Ain’t Nobody",
      "I'm Every Woman",
      "Move On Up",
      "Chain Reaction",
      "I'm Coming Out",
      "I Only Wanna Be With You",
      "Son Of A Preacher Man",
      "At Last",
      "Can't Help Myself",
      "It's The Same Old Song",
      "Reach Out, I'll Be There",
      "Sugar Pie Honeybunch",
      "Higher And Higher",
      "Dancing In The Street",
      "Heatwave",
      "How Sweet It Is To Be Loved By You",
      "I Heard It Through The Grapevine",
      "It Takes Two",
      "Ain’t No Mountain High Enough",
      "My Guy",
      "L-O-V-E",
    ];
    const selectedSongsString = ""; // Define selectedSongsString with a default empty string or appropriate value
    const safeSelectedSongs = selectedSongsString || [
      "When I Fall In Love",
      "Georgia On My Mind",
      "Hit The Road Jack",
      "Soul Man",
      "Tears Of A Clown",
      "Tracks Of My Tears",
      "For Once In My Life",
      "I Wish",
      "Isn't She Lovely",
      "Signed Sealed And Delivered",
      "Superstition",
      "Mustang Sally",
      "Best Of My Love",
      "This Old Heart Of Mine",
      "Love Train",
      "You To Me Are Everything",
      "Be My Baby",
      "Will You Still Love Me Tomorrow",
      "Baby Love",
      "Can't Hurry Love",
      "Stop! In The Name Of Love",
      "You Keep Me Hanging On",
      "Get Ready",
      "My Girl",
      "River Deep",
      "In The Midnight Hour",
      "Teardrops",
      "Dancing Queen",
      "Gimme Gimme Gimme",
      "I Have a Dream",
      "Knowing Me Knowing You",
      "Lay All Your Love On Me",
      "Mamma Mia",
      "Money Money Money",
      "Super Trouper",
      "The Winner Takes It All",
      "Voulez-Vous",
      "Waterloo",
      "Stayin' Alive",
      "Hot Stuff",
      "Last Dance",
      "September",
      "December '63 (Oh What A Night)",
      "I Will Survive",
      "ABC",
      "I Want You Back",
      "All Night Long",
      "Dancing On The Ceiling",
      "Never Too Much",
      "Car Wash",
      "Blame It On The Boogie",
      "Disco Inferno",
      "I Got You (I Feel Good)",
      "Baby Give It Up",
      "Give It Up",
      "That's The Way I Like It",
      "Celebration",
      "Get Down on It",
      "Ladies Night",
      "Ain’t No Stopping Us Now",
      "Lady Marmalade",
      "Kiss",
      "We Are Family",
      "Play That Funky Music",
      "Sex On Fire",
      "Use Somebody",
      "Wonderwall",
      "Chasing Cars",
      "Mr Brightside",
      "Highway To Hell",
      "I Don't Want To Miss A Thing",
      "One Way Or Another",
      "The Tide Is High",
      "Living On A Prayer",
      "Holding Out For A Hero",
      "Summer Of '69",
      "Bad Moon Rising",
      "Hotel California",
      "Sweet Caroline",
      "Don't Speak",
      "Another One Bites The Dust",
      "Bohemian Rhapsody",
      "Crazy Little Thing Called Love",
      "Don’t Stop Me Now",
      "We Will Rock You",
      "A Kind of Magic",
      "Under Pressure",
      "Stuck In The Middle With You",
      "Eye Of The Tiger",
      "You Really Got Me",
      "I'm Gonna Be (500 Miles)",
      "Satisfaction",
      "My Generation",
      "Simply The Best",
      "Proud Mary",
      "Teenage Dirtbag",
      "Rock Around The Clock",
      "Achy Breaky Heart",
      "Johnny B. Goode",
      "Burning Love",
      "Can't Help Falling In Love",
      "Hound Dog",
      "Jailhouse Rock",
      "Suspicious Minds",
    ];
    const safeActSize = actSize || "3-piece, 4-piece, 5-piece, 6-piece";
    const bandMembers = []; // Define bandMembers with a default empty array or appropriate value
    const safeBandInstruments =
      bandMembers.map((member) => member.instrument).join(", ") ||
      "vocalist, bass, guitar, keyboard, drums";
    const safeName = name || "The Party Starters";
    const existingNamesString =
      existingNames.length > 0
        ? existingNames.join(", ")
        : "No existing acts found.";

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Generate a unique and catchy band name similar in style to "${name}". 
                          Draw inspiration from the following details: 
                        - Description: ${safeDescription}
                        - Bio: ${safeBio}
                        - Genre(s): ${safeGenre} 
                        - Original Act Name: ${safeName}
                        - Repertoire: ${safeRepertoire.join(", ")}
                        - Additional Repertoire songs: ${safeCustomRepertoire.join(
                          ", "
                        )}
                        - And More Repertoire songs: ${safeSelectedSongs.join(
                          ", "
                        )}
                        - Act Size: ${safeActSize}
                        - Band Member Instruments: ${safeBandInstruments}
                        - Ensure the name is NOT in this list of existing acts: ${existingNamesString}
                            Make it creative, engaging, and different.`,
            },
          ],
          max_tokens: 15,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      setSuggestedName(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error generating band name:", error);
      alert("Failed to generate band name. Check API key or OpenAI account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full mb-[-12px]">
        <p>
          <strong>Provide A Unique Band Name</strong> to be used solely with The
          Supreme Collective
        </p>
      </div>
      <div className="flex items-center gap-4 w-full">
        <input
          onChange={(e) => setTscName(e.target.value)}
          value={tscName}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Suggest a unique name for your act"
        />

        <button
          type="button"
          onClick={generateBandName}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff6667] text-white rounded hover:bg-red-600 transition"
          disabled={loading}
        >
          <img src={assets.ai_icon} alt="AI" className="w-7 h-7" />
          {loading ? "Generating..." : "Generate Band Name"}
        </button>

        {/* Show AI Suggested Name (conditionally displayed) */}
        {suggestedName && (
          <div className="bg-gray-100 p-3 rounded flex items-center gap-3">
            <p className="text-gray-700">
              Suggested: <strong>{suggestedName}</strong>
            </p>
            <button
              type="button"
              onClick={() => setTscName(suggestedName)}
              className="px-4 py-1 bg-[#ff6667] text-white rounded hover:bg-black transition"
            >
              Use this name
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BandNameGenerator;
