export default function useResponsive() {
    const isMobile = window.innerHeight < 768;

    return { isMobile };
}