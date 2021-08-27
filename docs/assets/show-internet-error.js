// check if there is any element with href="(https:)?//" or src="(https:)?//"
const el = document.querySelector('[href^="http"], [href^="//"], [src^="http"], [src^="//"]');
if (el) {
  // if so, make a fetch call to the https://unpkg.com/elements-x
  window.fetch('//unpkg.com/elements-x')
    .then(resp => { 
      !resp.ok && alert('Requires internet connection, but not fully working');
    }).catch(e => {
      // if not successful, show an error message with close button
      alert('Requires internet connection, but not fully working');
    });
}
