import { MODULE_ABBREV, MODULE_ID, MySettings, TEMPLATES } from '../constants';
import { log } from '../helpers';
import { GmScreenConfig } from '../../gridTypes';

const defaultGmScreenConfig: GmScreenConfig = {
  activeGridId: 'default',
  grids: {
    default: {
      name: 'Main',
      id: 'default',
      entries: {},
    },
  },
};

export const registerSettings = function () {
  // Debug use
  CONFIG[MODULE_ID] = { debug: true };
  // CONFIG.debug.hooks = true;
};

export class GmScreenSettings extends FormApplication {
  static init() {
    game.settings.registerMenu(MODULE_ID, 'menu', {
      name: 'D&D5e Extender Settings',
      label: 'Extender Settings',
      icon: 'fas fa-hammer',
      type: GmScreenSettings,
      restricted: true,
    });

    game.settings.register(MODULE_ID, MySettings.gmScreenConfig, {
      name: `${MODULE_ABBREV}.settings.${MySettings.gmScreenConfig}.Name`,
      default: defaultGmScreenConfig,
      type: Object,
      scope: 'world',
      config: false,
      hint: `${MODULE_ABBREV}.settings.${MySettings.gmScreenConfig}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.migrated, {
      config: false,
      default: { status: false, version: '1.2.2' },
      scope: 'world',
      type: Object,
    });

    game.settings.register(MODULE_ID, MySettings.columns, {
      name: `${MODULE_ABBREV}.settings.${MySettings.columns}.Name`,
      default: 4,
      type: Number,
      scope: 'world',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.columns}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.rows, {
      name: `${MODULE_ABBREV}.settings.${MySettings.rows}.Name`,
      default: 3,
      type: Number,
      scope: 'world',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.rows}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.displayDrawer, {
      name: `${MODULE_ABBREV}.settings.${MySettings.displayDrawer}.Name`,
      default: true,
      type: Boolean,
      scope: 'world',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.displayDrawer}.Hint`,
      onChange: () => window.location.reload(),
    });

    game.settings.register(MODULE_ID, MySettings.rightMargin, {
      name: `${MODULE_ABBREV}.settings.${MySettings.rightMargin}.Name`,
      default: 0,
      type: Number,
      scope: 'world',
      range: { min: 0, max: 75, step: 5 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.rightMargin}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.drawerWidth, {
      name: `${MODULE_ABBREV}.settings.${MySettings.drawerWidth}.Name`,
      default: 100,
      type: Number,
      scope: 'world',
      range: { min: 25, max: 100, step: 5 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.drawerWidth}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.drawerHeight, {
      name: `${MODULE_ABBREV}.settings.${MySettings.drawerHeight}.Name`,
      default: 60,
      type: Number,
      scope: 'world',
      range: { min: 10, max: 90, step: 5 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.drawerHeight}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.drawerOpacity, {
      name: `${MODULE_ABBREV}.settings.${MySettings.drawerOpacity}.Name`,
      default: 1,
      type: Number,
      scope: 'world',
      range: { min: 0.1, max: 1, step: 0.05 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.drawerOpacity}.Hint`,
    });

    game.settings.register(MODULE_ID, MySettings.reset, {
      name: `${MODULE_ABBREV}.settings.${MySettings.reset}.Name`,
      default: false,
      type: Boolean,
      scope: 'world',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.reset}.Hint`,
      onChange: (selected) => {
        if (selected) {
          game.settings.set(MODULE_ID, MySettings.gmScreenConfig, defaultGmScreenConfig);
        }
      },
    });
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ['dnd5e-extender-settings'],
      closeOnSubmit: false,
      height: 'auto',
      submitOnChange: false,
      submitOnClose: false,
      template: TEMPLATES.settings,
      title: 'D&D5e Extender Settings',
      tabs: [
        {
          navSelector: '.tabs',
          contentSelector: 'form',
          initial: 'warning',
        },
      ],
      width: 600,
    };
  }

  constructor(object = {}, options) {
    super(object, options);
  }

  getSettingsData() {
    const gmScreenConfig: GmScreenConfig = game.settings.get(MODULE_ID, MySettings.gmScreenConfig);

    log(false, 'getSettingsData', {
      gmScreenConfig,
    });

    return {
      grids: gmScreenConfig.grids,
    };
  }

  getData() {
    let data = super.getData();
    data.settings = this.getSettingsData();

    log(false, data);
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    log(false, 'activateListeners', {
      html,
    });

    const handleNewRowClick = async (currentTarget: JQuery<any>) => {
      log(false, 'add row clicked', {
        data: currentTarget.data(),
      });

      const table = currentTarget.data().table;

      const tableElement = currentTarget.siblings('table');
      const tbodyElement = $(tableElement).find('tbody');

      const newRowData = {
        index: tbodyElement.children().length,
        item: {
          isEditable: true,
          id: '',
          name: '',
        },
      };

      const newRow = $(await renderTemplate(TEMPLATES[table].tableRow, newRowData));
      // render a new row at the end of tbody
      tbodyElement.append(newRow);
    };

    const handleDeleteRowClick = (currentTarget: JQuery<any>) => {
      log(false, 'delete row clicked', {
        currentTarget,
      });

      currentTarget.parentsUntil('tbody').remove();
    };

    html.on('click', (e) => {
      const currentTarget = $(e.target).closest('button')[0];

      if (!currentTarget) {
        return;
      }

      const wrappedCurrentTarget = $(currentTarget);

      log(false, 'a button was clicked', { e, currentTarget });

      if (wrappedCurrentTarget.hasClass('add-row')) {
        handleNewRowClick(wrappedCurrentTarget);
      }
      if (wrappedCurrentTarget.hasClass('delete-row')) {
        handleDeleteRowClick(wrappedCurrentTarget);
      }
    });
  }

  async _updateObject(ev, formData) {
    const data = expandObject(formData);

    log(false, {
      formData,
      data,
    });

    const abilitiesArray = Object.values(data.abilities || {});
    const skillsArray = Object.values(data.skills || {});

    const newCustomAbilities = abilitiesArray.length ? mergeObject(customAbilities, abilitiesArray) : abilitiesArray;
    const newCustomSkills = skillsArray.length ? mergeObject(customSkills, skillsArray) : skillsArray;

    log(true, 'setting settings', {
      abilities: newCustomAbilities,
      skills: newCustomSkills,
    });

    await game.settings.set(MODULE_ID, MySettings.customAbilities, newCustomAbilities);
    await game.settings.set(MODULE_ID, MySettings.customSkills, newCustomSkills);

    location.reload();
  }
}
