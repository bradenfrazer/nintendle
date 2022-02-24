export default function About() {
  return ( 
    <div>
      <p>Nintendle is a <a href='https://www.nytimes.com/games/wordle/index.html' target='_blank'>Wordle</a> clone with an emphasis on Nintendo-themed solutions.
      
      The dictionary of solutions was curated by hand and includes a variety of Nintendo characters, themes, locations, and concepts. Some of the references are pretty minor! <a href='https://www.ssbwiki.com/List_of_spirits_(complete_list)' target='_blank'>This list of Nintendo references from Super Smash Bros. Ultimate</a> was used as a source of truth when building the dictionary, and may be of help when working out some of the solutions, though not every Nintendle came from this list!</p>
      <p className='mt-4'><strong>Rules:</strong></p>
      <p>The same rules as standard Wordle apply to Nintendle.</p>
      <p className='mt-4'><strong>Credits:</strong></p>
      <p>Josh Wardle for Wordle</p>
      <p>Harry Wolff for <a href='https://github.com/hswolff/reacdle' target='_blank'>his implementation</a> of <a href='https://hswolff.github.io/reacdle/' target='_blank'>Reacdle</a>, which Nintendle is based on.</p>
    </div>
  )
}