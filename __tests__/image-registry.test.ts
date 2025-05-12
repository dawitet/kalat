// __tests__/image-registry.test.ts
import {getImageSource} from '../assets/imageRegistry';

describe('ImageRegistry', () => {
  it('should return valid image sources', () => {
    // Test main images
    expect(getImageSource('adey')).not.toBeNull();
    expect(getImageSource('dave')).not.toBeNull();
    expect(getImageSource('dog')).not.toBeNull();

    // Test icons
    expect(getImageSource('adey_icon')).not.toBeNull();
    expect(getImageSource('icon_home')).not.toBeNull();
    expect(getImageSource('icon_feedback')).not.toBeNull();
    expect(getImageSource('icon_share')).not.toBeNull();

    // Test SVG files
    expect(getImageSource('kalat_logo_svg')).not.toBeNull();
  });

  it('should handle unknown image names gracefully', () => {
    expect(getImageSource('nonexistent_image')).toBeNull();
  });
});
