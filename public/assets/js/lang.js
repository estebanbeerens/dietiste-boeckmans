/*
 * Custom params
*/
const mainLanguage = 'nl';
const supportedLanguages = ['nl'];

translateHTML();

/*
 * Language translation logic
*/
function translateHTML() {
    // Get browser language
    const browserLanguage = navigator.language;

    // Check if the browser language is supported on the site
    // If the browser language is not supported, use the main lang file
    const usedLanguage = supportedLanguages.find(l => browserLanguage.includes(l)) ? supportedLanguages.find(l => browserLanguage.includes(l)) : mainLanguage;

    // Get the translation data
    $.getJSON(`assets/lang/${usedLanguage}.json`, function (translationData) {

        // Set the HTML to have the correct language
        $('html').attr('lang', usedLanguage);

        // Populate the HTML fields with the right translation
        $.each(translationData, function (key, value) {
            $(`[translation='${key}'`).html(value);
        });
    });
}
