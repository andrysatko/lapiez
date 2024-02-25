export function CountSiderWidth(width: number): string {
    if (width >= 1024) { // Desktop
        if (width >= 2560) { // 2K and 4K screens
            return '15%'; // 1/4 of the screen
        }
        return '20%'; // 1/2 of the screen
    } else if (width >= 768) { // Tablet
        return '66.66%'; // 2/3 of the screen
    } else { // Mobile
        if (width >= 480) { // Large mobile devices
            return '83.33%'; // 5/6 of the screen
        }
        return '75%'; // 3/4 of the screen
    }
}