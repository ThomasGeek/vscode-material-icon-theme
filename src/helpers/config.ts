import * as helpers from './index';
import * as vscode from 'vscode';
import { checkAngularIconsStatus, enableAngularIcons, disableAngularIcons } from "../commands/angular";
import { enableSpecificFolderIcons, enableClassicFolderIcons, enableBlueFolderIcons, disableFolderIcons, checkFolderIconsStatus, FolderType } from "../commands/folders";

/** Store the latest version number in the user data settings. */
export const updateVersionInUserDataSettings = () => {
    const setting = {
        version: helpers.getCurrentExtensionVersion(),
    };
    return helpers.writeUserDataSettings(setting);
};

/** Initialize the user data settings. */
export const initUserDataSettings = () => {
    const setting = {
        name: 'material-icon-theme',
        version: helpers.getCurrentExtensionVersion()
    };
    return helpers.writeUserDataSettings(setting);
};

/** Watch for changes in the configurations to update the icons theme. */
export const watchForConfigChanges = () => {
    vscode.workspace.onDidChangeConfiguration(configChangeDetection);
};

/**
 * Compare the workspace and the user configurations
 * with the current setup of the icons.
*/
export const configChangeDetection = () => {
    return compareAngularConfigs()
        .then(() => compareFolderConfigs());
};

const compareAngularConfigs = () => {
    const angularIconsConfig = helpers.getThemeConfig('angular.iconsEnabled');

    return checkAngularIconsStatus().then(result => {
        if (angularIconsConfig.workspaceValue === true || angularIconsConfig.globalValue === true) {
            if (!result) { enableAngularIcons(); }
        }
        else if (
            (angularIconsConfig.workspaceValue === false && angularIconsConfig.globalValue === false) ||
            (angularIconsConfig.workspaceValue === undefined && angularIconsConfig.globalValue === false) ||
            (angularIconsConfig.workspaceValue === false && angularIconsConfig.globalValue === undefined)) {

            if (result) { disableAngularIcons(); }
        }
    });
};

const compareFolderConfigs = () => {
    const folderIconsConfig = helpers.getThemeConfig('folders.icons');

    return checkFolderIconsStatus().then(result => {
        switch (result) {
            case FolderType.None:
                if (folderIconsConfig.globalValue === "specific") {
                    enableSpecificFolderIcons();
                } else if (folderIconsConfig.globalValue === "classic") {
                    enableClassicFolderIcons();
                } else if (folderIconsConfig.globalValue === "blue") {
                    enableBlueFolderIcons();
                }
                break;

            case FolderType.Specific:
                if (folderIconsConfig.globalValue === "none") {
                    disableFolderIcons();
                } else if (folderIconsConfig.globalValue === "classic") {
                    enableClassicFolderIcons();
                } else if (folderIconsConfig.globalValue === "blue") {
                    enableBlueFolderIcons();
                }
                break;

            case FolderType.Classic:
                if (folderIconsConfig.globalValue === "none") {
                    disableFolderIcons();
                } else if (folderIconsConfig.globalValue === "specific") {
                    enableSpecificFolderIcons();
                } else if (folderIconsConfig.globalValue === "blue") {
                    enableBlueFolderIcons();
                }
                break;

            case FolderType.Blue:
                if (folderIconsConfig.globalValue === "none") {
                    disableFolderIcons();
                } else if (folderIconsConfig.globalValue === "specific") {
                    enableSpecificFolderIcons();
                } else if (folderIconsConfig.globalValue === "classic") {
                    enableClassicFolderIcons();
                }
                break;

            default:
                break;
        }
    });
};