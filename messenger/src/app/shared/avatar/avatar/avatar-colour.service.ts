import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AvatarColourService {
    private avatarColours = new Map();
    private colourPalette = [
        '#3EBDE5',
        '#CF3E69',
        '#2B64AF',
        '#6E70A3',
        '#1F5E73',
        '#7E2870',
        '#184684',
        '#4b246B',
    ];

    public getColour(userId: string | null | undefined): string {
        if (!userId) {
            return this.colourPalette[0];
        }

        if (this.avatarColours.has(userId)) {
            return this.avatarColours.get(userId);
        }

        const newSelectedColour =
            this.colourPalette[Math.floor(Math.random() * this.colourPalette.length)];

        this.avatarColours.set(userId, newSelectedColour);

        return newSelectedColour;
    }
}
