export default function About() {
  return ( 
    <div id='about' className='text-left'>
      <p>Nintendle is a <a href='https://www.nytimes.com/games/wordle/index.html' target='_blank'>Wordle</a> clone with an emphasis on Nintendo-themed solutions. Like Wordle, Nintendle features a new challenge each day (one for every day of the year) and includes a share button to easily share your score.</p>
      
      <p>The dictionary of solutions was curated by hand and includes a variety of Nintendo characters, themes, locations, and concepts. Some of the references are pretty minor! <a href='https://www.ssbwiki.com/List_of_spirits_(complete_list)' target='_blank'>This list of Nintendo references from Super Smash Bros. Ultimate</a> was used as a source of truth when building the dictionary, and may be of help when working out some of the solutions, though not every Nintendle came from this list!</p>
      <p className='mt-4'><strong>Rules:</strong></p>
      <p>The same rules as standard Wordle apply to Nintendle.</p>

      <p className='mt-4'><strong>Tips:</strong></p>
      <ul>
        <li>Check the link above to brush up on your Nintendo references before playing!</li>
        <li>Many of the solutions have multiple of the same letter. Don't forget your doubles.</li>
        <li>A selection of common English words are also allowed as guesses, even if they aren't the answer. Use this to your advantage to whittle down your letter options.</li>
      </ul>

      <p className='mt-4'><strong>Credits:</strong></p>
      <ul>
        <li>Josh Wardle for Wordle</li>
        <li>Harry Wolff for <a href='https://github.com/hswolff/reacdle' target='_blank'>his implementation</a> of <a href='https://hswolff.github.io/reacdle/' target='_blank'>Reacdle</a>, which Nintendle is based on.</li>
      </ul>
    </div>
  )
}