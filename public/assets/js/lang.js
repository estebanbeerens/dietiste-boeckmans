/*******************************************
 * 
 * IMPORTANT!
 * THIS FILE REQUIRES JQuery, IMPORT IT INTO YOUR HTML FILE
 * <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
 * 
 * ALSO IMPORT SCRIPT
 * <script src="assets/js/lang.js"></script>
 * 
 *******************************************/

/*
 * Custom params
*/
const mainLanguage = 'nl';
const supportedLanguages = ['nl'];
const translationAttributes = ['placeholder']

// Run it!
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
                if ($(`[trans='${key}'`).length) {
                    $(`[trans='${key}'`).html(value);
                    return;
                }

                let attributeFound = false;

                // Special case
                translationAttributes.forEach(attribute => {
                    if ($(`[${attribute}*='{{'][${attribute}*='${key}'][${attribute}*='}}']`).length) {
                        $(`[${attribute}*='{{'][${attribute}*='${key}'][${attribute}*='}}']`).attr(attribute, value);
                        attributeFound = true;
                    }
                });

                if (attributeFound) return;

                console.warn(`Translation "${key}" was declared in ${language}.json, but is never used.`)
            });

            // Check if we have missing translations
            $.each($("[trans]:empty"), function (key, value) {
                // Mark missing translation in HTML
                $(value).html(`@trans_${$(value).attr('trans')}`);
                $(value).addClass('fw-bold text-warning');

                // Throw error in console
                console.error(`Missing translation "${$(value).attr('trans')}" in ${language}.json.`);
            });
        });
    } catch (error) {
        console.error(error);
    }
}
