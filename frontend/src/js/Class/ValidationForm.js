const passwordValidator = require('password-validator')

class ValidationForm {
    /**
     * Vérifie la validité d'un email
     * @param email
     * @returns {boolean}
     */
    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    /**
     * Vérifie si le champ est vide ou null
     * @param field
     * @returns {string|boolean}
     */
    fieldIsInvalid(field) {
        return field.value === '' || field.value === null;
    }

    /**
     * Affiche un rendu si le champ est invalide
     * @param field
     * @param messageError
     */
    renderInvalidField(field, messageError = null) {
        let parent = field.parentNode
        let invalidsFeedback = parent.querySelectorAll('.invalid-feedback')
        if (invalidsFeedback.length > 0) {
            invalidsFeedback.forEach((el) => {
                el.remove()
            })
        } else {
            field.classList.add('is-invalid')
            parent.insertAdjacentHTML('beforeend', `<div class="invalid-feedback">${messageError}</div>`)
        }
    }

    /**
     * Nettoie le rendu des champs en cas de précédentes erreurs
     * @param field
     */
    fieldClearRender(field) {
        let parent = field.parentNode
        let invalidsFeedback = parent.querySelectorAll('.invalid-feedback')
        if (field.classList.contains('is-invalid')) {
            field.classList.remove('is-invalid')
        }
        if (invalidsFeedback.length > 0) {
            invalidsFeedback.forEach((el) => {
                el.remove()
                field.classList.remove('is-invalid')
            })
        }
    }

    /**
     * Affiche un rendu si le champ est valide
     * @param field
     */
    renderValidField(field) {
        let parent = field.parentNode
        let invalidsFeedback = parent.querySelectorAll('.invalid-feedback')
        if (invalidsFeedback.length > 0) {
            invalidsFeedback.forEach((el) => {
                el.remove()
                field.classList.remove('is-invalid')
            })
        } else {
            field.classList.add('is-valid')
        }
    }

    /**
     * Vérifie si le mot de passe est valide
     * @param password
     * @returns {boolean}
     */
    passwordIsValid(password) {
        const schemaPassword = new passwordValidator()
        schemaPassword
            .is().min(5)
            .has().uppercase()
            .has().lowercase()
            .has().not().spaces()
        return schemaPassword.validate(password)
    }
}

export default new ValidationForm;