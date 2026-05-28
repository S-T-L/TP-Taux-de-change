<template>
    <div class="board">
        <h1>BUREAU DE CHANGE</h1>
        <p class="subtitle">EXCHANGE OFFICE</p>

        <div class="saisie">
            <label for="montant-xpf">Montant à convertir</label>
            <div class="saisie-champ" :class="{ 'champ-erreur': erreurMontant }">
                <input id="montant-xpf" type="number" v-model.number="xpfSaisi" min="0" placeholder="Ex : 1000" />
                <select class="devise-select" v-model="deviseSource">
                    <option value="XPF">XPF</option>
                    <option v-for="d in devises" :key="d.code" :value="d.code">{{ d.code }}</option>
                </select>
            </div>
            <span v-if="erreurMontant" class="message-erreur">{{ erreurMontant }}</span>
        </div>

        <p v-if="derniereMiseAJour" class="maj">
            Dernière mise à jour : {{ derniereMiseAJour }}
        </p>

        <div class="grid">
            <div class="card" :class="{ 'card--disabled': devise.estSource }" v-for="devise in devisesAvecFlag"
                :key="devise.code">
                <img :src="devise.flag" :alt="devise.nom" />
                <div class="info">
                    <span class="nom">{{ devise.nom }}</span>
                    <span class="code">{{ devise.code }}</span>
                </div>
                <span class="montant">{{ devise.montantConverti }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchLatestRates } from '@/services/exchangeRate'

export default {
    name: 'CurrencyBoard',

    data() {
        return {
            xpfSaisi: 1000,
            deviseSource: 'XPF',
            derniereMiseAJour: null,
            intervalId: null,
            devises: [
                { code: 'AUD', nom: 'Dollar australien', pays: 'au', taux: null },
                { code: 'NZD', nom: 'Dollar néo-zélandais', pays: 'nz', taux: null },
                { code: 'CAD', nom: 'Dollar canadien', pays: 'ca', taux: null },
                { code: 'USD', nom: 'Dollar US', pays: 'us', taux: null },
                { code: 'FJD', nom: 'Dollar fidjien', pays: 'fj', taux: null },
                { code: 'SGD', nom: 'Dollar de Singapour', pays: 'sg', taux: null },
                { code: 'THB', nom: 'Baht thaïlandais', pays: 'th', taux: null },
                { code: 'CHF', nom: 'Franc suisse', pays: 'ch', taux: null },
                { code: 'EUR', nom: 'Euro', pays: 'eu', taux: null },
                { code: 'GBP', nom: 'Livre sterling', pays: 'gb', taux: null },
                { code: 'JPY', nom: 'Yen', pays: 'jp', taux: null },
                { code: 'VUV', nom: 'Vatu', pays: 'vu', taux: null },
            ]
        }
    },

    mounted() {
        this.chargerTaux()
        this.intervalId = setInterval(this.chargerTaux, 3600000)
    },

    beforeUnmount() {
        clearInterval(this.intervalId)
    },

    methods: {
        async chargerTaux() {
            try {
                const data = await fetchLatestRates('XPF')
                const rates = data.conversion_rates
                this.devises = this.devises.map(devise => ({
                    ...devise,
                    taux: rates[devise.code]
                }))
                this.derniereMiseAJour = new Date().toLocaleTimeString('fr-FR')
            } catch (error) {
                console.warn('Impossible de charger les taux :', error.message)
            }
        }
    },

    computed: {
        erreurMontant() {
            if (this.xpfSaisi === '' || this.xpfSaisi === null || typeof this.xpfSaisi !== 'number' || isNaN(this.xpfSaisi)) {
                return 'Veuillez saisir un montant valide.'
            }
            if (this.xpfSaisi < 0) {
                return 'Le montant ne peut pas être négatif.'
            }
            return null
        },

        devisesAvecFlag() {
            let tauxSource

            if (this.deviseSource === 'XPF') {
                tauxSource = 1
            } else {
                const deviseSelectionnee = this.devises.find(d => d.code === this.deviseSource)
                if (!deviseSelectionnee || deviseSelectionnee.taux === null) return []
                tauxSource = deviseSelectionnee.taux
            }

            const result = []

            this.devises.forEach(d => {
                const estSource = d.code === this.deviseSource
                let montantConverti

                if (this.erreurMontant || estSource) {
                    montantConverti = '—'
                } else if (d.taux !== null) {
                    montantConverti = (this.xpfSaisi * d.taux / tauxSource).toFixed(2)
                } else {
                    montantConverti = '...'
                }

                result.push({
                    code: d.code,
                    nom: d.nom,
                    pays: d.pays,
                    taux: d.taux,
                    flag: `https://flagcdn.com/w40/${d.pays}.png`,
                    montantConverti: montantConverti,
                    estSource: estSource
                })
            })

            return result
        }
    }
}
</script>

<style scoped>
.board {
    padding: 24px;
    text-align: center;
}

.saisie {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 32px;
}

.saisie label {
    color: #a0b4cc;
    font-size: 0.85rem;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.saisie-champ {
    display: flex;
    align-items: center;
    background: #0d2444;
    border: 1px solid #1a3a6b;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;
}

.saisie-champ.champ-erreur {
    border-color: #e05252;
}

.message-erreur {
    color: #e05252;
    font-size: 0.78rem;
    margin-top: 4px;
}

.saisie-champ input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 1.4rem;
    font-weight: bold;
    padding: 10px 16px;
    width: 180px;
    text-align: right;
}

.saisie-champ input::-webkit-inner-spin-button,
.saisie-champ input::-webkit-outer-spin-button {
    -webkit-appearance: none;
}

.saisie-champ input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.devise-select {
    color: #f0c040;
    font-weight: bold;
    font-size: 1rem;
    padding: 10px 14px;
    border: none;
    border-left: 1px solid #1a3a6b;
    background: #0a1628;
    cursor: pointer;
    outline: none;
}

.card--disabled {
    opacity: 0.35;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.board h1 {
    color: #fff;
    font-size: 2rem;
    letter-spacing: 4px;
}

.subtitle {
    color: #a0b4cc;
    font-size: 0.9rem;
    letter-spacing: 2px;
    margin-bottom: 32px;
}

.maj {
    font-size: 0.75rem;
    color: #4a7fa5;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
}

.grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    max-width: 900px;
    margin: 0 auto;
}


@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fond-glissement {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #0d2444, #1a3a6b, #0d3a5c);
    background-size: 150% 150%;
    animation: fade-in-up 0.5s ease both, fond-glissement 12s ease-in-out infinite;
    border-radius: 8px;
    color: #fff;
}

.card img {
    width: 40px;
    height: auto;
    border-radius: 3px;
    flex-shrink: 0;
}

.info {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-align: left;
}

.nom {
    font-size: 0.75rem;
    color: #a0b4cc;
    text-transform: uppercase;
}

.code {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
}

.montant {
    font-size: 1rem;
    font-weight: bold;
    color: #f0c040;
    white-space: nowrap;
}

/* Tablette */
@media (max-width: 768px) {
    .board h1 {
        font-size: 1.4rem;
    }

    .saisie-champ input {
        width: 130px;
        font-size: 1.1rem;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .grid {
        grid-template-columns: 1fr;
    }

    .board h1 {
        font-size: 1.1rem;
        letter-spacing: 2px;
    }

    .board {
        padding: 16px;
    }
}
</style>
