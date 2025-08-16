
import { useState, useEffect } from 'react';

// Hook to manage state with localStorage persistence
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    // Get stored value from localStorage or use initialValue
    const getStoredValue = (): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    // Update localStorage whenever the state changes
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            }
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
