interface Resources {
  "common": {
    "back": "Zpět",
    "cancel": "Zrušit",
    "close": "Zavřít",
    "save": "Uložit změny",
    "inputs": {
      "autocompleteInputPlaceholder": "Vyberte možnost nebo začněte psát pro vyhledávání...",
      "singleDateInputPlaceholder": "Vyberte datum kliknutím"
    },
    "actions": {
      "logout": "Odhlásit se",
      "modifyProfile": "Upravit profil"
    },
    "settings": {
      "pageTitle": "Nastavení a tvůj profil",
      "app": {
        "title": "Nastavení aplikace",
        "themeSetting": {
          "label": "Motiv aplikace",
          "options": {
            "system": "Podle systému",
            "light": "Světlý",
            "dark": "Tmavý"
          }
        },
        "languageSetting": {
          "label": "Jazyk aplikace",
          "options": {
            "cs": "Čeština",
            "en": "English"
          }
        }
      }
    }
  },
  "shopping-list": {
    "actions": {
      "newList": "Nový nákupní seznam",
      "editList": "Upravit nákupní seznam",
      "deleteList": "Smazat nákupní seznam",
      "closeList": "Uzavřít nákupní seznam",
      "leaveList": "Opustit nákupní seznam"
    },
    "list": {
      "pageTitle": "Tvoje nákupní seznamy",
      "filter": {
        "sectionTitle": "Filtry",
        "modal": {
          "trigger": "Upravit filtry",
          "hint": "Filtry, které zde nastavíš, se ihned aplikují."
        },
        "label": {
          "search": "Vyhledat",
          "completeBy": "Dokončit před",
          "showCompleted": "Zobrazit hotové"
        },
        "placeholder": {
          "search": "Víkendová party...",
          "completeBy": "Vyberte datum dokončení"
        },
        "tabs": {
          "all": "Všechny seznamy",
          "own": "Moje seznamy",
          "shared": "Sdílené se mnou"
        }
      }
    },
    "common": {
      "photoHint": "Ilustrační fotka seznamu",
      "nameHint": "Název nákupního seznamu",
      "itemCount_zero": "Žádné položky",
      "itemCount_one": "{{count}} položka",
      "itemCount_two": "{{count}} položky",
      "itemCount_few": "{{count}} položky",
      "itemCount_other": "{{count}} položek"
    },
    "card": {
      "itemCountCompleted_zero": "Žádné hotové",
      "itemCountCompleted_one": "{{count}} hotová",
      "itemCountCompleted_two": "{{count}} hotové",
      "itemCountCompleted_other": "{{count}} hotových",
      "completeBy": "Dokončit před {{date}}",
      "completedAt": "Dokončeno {{date}}",
      "createdBy": "Vytvořil",
      "showDetail": "Zobrazit detail"
    },
    "detail": {
      "stats": {
        "itemCombinedStat": "Počet položek / Hotové položky",
        "itemCountCompleted_zero": "Žádné hotové položky",
        "itemCountCompleted_one": "{{count}} hotová položka",
        "itemCountCompleted_two": "{{count}} hotové položky",
        "itemCountCompleted_other": "{{count}} hotových položek",
        "completeBy": "Dokončit nákup před",
        "completedAt": "Dokončeno",
        "lastUpdated": "Naposledy upraveno",
        "createdBy": "Vytvořeno uživatelem"
      },
      "items": {
        "sectionTitle": "Položky",
        "showCompleted": "Zobrazit i hotové",
        "amountPlaceholder": "Množství",
        "namePlaceholder": "Název",
        "addItem": "Přidat položku",
        "editItem": "Upravit položku",
        "deleteItem": "Smazat položku",
        "markItemCompleted": "Označit jako hotovou",
        "completedBy": "{{user}} koupil tuto položku"
      },
      "members": {
        "action": "Upravit členy seznamu",
        "sectionTitle": "Členové seznamu",
        "sectionPrompt": "Zde můžete přidávat nové členy seznamu, upravovat práva stávajících členů, nebo některé členy odstranit.",
        "permission": {
          "read": "Může číst a odškrávat položky",
          "write": "Může číst, přidávat a odškrávat položky"
        },
        "inputs": {
          "user": "Uživatel",
          "permission": "Oprávnění uživatele"
        },
        "modal": {
          "addMemberTitle": "Přidání člena",
          "editMemberPermissionsTitle": "Upravení práv člena",
          "deleteTitle": "Odstranění člena",
          "deleteDescription": "Odstraněním člena z nákupního seznamu uživatel ztratí přístup k seznamu a jeho položkám. Pokud mu budete chtít tyto informace znovu zpšístupnit, budete ho muset přidat znovu."
        },
        "actions": {
          "addMemberPrompt": "Přidat člena",
          "editMemberPermissionsPrompt": "Upravit práva člena",
          "deleteMember": "Odebrat člena ze seznamu",
          "confirmDeleteMember": "Ano, chci člena ze seznamu odebrat",
          "rejectDeleteMember": "Ne, chci členovi nechat přístup"
        }
      }
    }
  }
}

export default Resources;
