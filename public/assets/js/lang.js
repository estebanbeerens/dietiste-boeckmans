/*
 * Custom params
*/
const mainLanguage = 'nl';
const supportedLanguages = ['nl'];

translateHTML();

/*
 * Language translation logic
*/
function translateHTML(language = undefined) {
    // If the given language is not supported, throw an error
    if (language && !supportedLanguages.includes(language)) {
        console.error(`The language "${language}" is not supported.`);
        return;
    }

    // Get browser language
    const browserLanguage = navigator.language;

    // Check if the browser language is supported on the site
    // If the browser language is not supported, use the main lang file
    if (!language) language = supportedLanguages.find(l => browserLanguage.includes(l)) ? supportedLanguages.find(l => browserLanguage.includes(l)) : mainLanguage;

    // Get the translation data
    try {
        $.getJSON(`assets/lang/${language}.json`, function (translationData) {

            // Set the HTML to have the correct language
            $('html').attr('lang', language);

            // Populate the HTML fields with the right translation
            $.each(translationData, function (key, value) {
                // Check if translations are used
                if ($(`[trans='${key}'`).length) $(`[trans='${key}'`).html(value);
                else console.warn(`Translation "${key}" was declared in ${language}.json, but is never used.`)
            });

            // Check if we have missing translations
            $.each($('[trans]:empty'), function (key, value) {
                // Mark missing translation in HTML
                $(value).html(`TRANS_${$(value).attr('trans')}`);
                $(value).addClass('fw-bold text-danger');

                // Throw error in console
                console.error(`Missing translation "${$(value).attr('trans')}" in ${language}.json.`);
            });
        });
    } catch (error) {
        console.error(error);
    }
}
