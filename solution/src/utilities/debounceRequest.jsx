// Creates a debounced version of a function that delays its execution.
// This is useful for postponing execution until after wait milliseconds
// have elapsed since the last time the debounced function was invoked.
// Common use cases include waiting for user input to stop before processing (e.g., while typing).
export const debounceRequest = (func, wait) => {
    let timeout;

    // Returns a function that, when called, resets any ongoing timeout
    // and sets a new one to call the original function after the specified delay
    return (...args) => {
        const later = () => {

            // Clear the existing timeout to ensure func is not called multiple times for trailing calls
            clearTimeout(timeout);

            // Call the passed function with the latest arguments
            func(...args);
        };
        clearTimeout(timeout); 

        // Set a new timeout to delay the function call
        timeout = setTimeout(later, wait); 
    };
}
