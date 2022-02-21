export default function About() {
  return ( 
    <div>
      <p className='mb-2'>Nintendle is a <a href='https://www.nytimes.com/games/wordle/index.html' target='_blank'>Wordle</a> clone with an emphasis on Nintendo-themed solutions.
      
      The dictionary of solutions was curated by hand and includes a variety of Nintendo characters, themes, locations, and concepts. Some of the references are pretty minor! <a href='https://www.ssbwiki.com/List_of_spirits_(complete_list)' target='_blank'>This list of Nintendo references from Super Smash Bros. Ultimate</a> was used as a source of truth when building the dictionary, and may be of help when working out some of the solutions, though not every Nintendle came from this list!</p>
      <p><strong>Rules:</strong></p>
      <p>The same rules as standard Wordle apply to Nintendle.</p>
      <p>Currently, only guesses contained in the dictionary of 366 solutions are allowed.</p>
    </div>
  )
}