/** PlantToggle is a custom plant toggle switch that accepts short text and
 * tailwindcss colors, as well as two functions from the parent component
 * that handle state changes. If no data is sent, the toggle functions using
 * default text and colors.
 *
 * Props:
 *   => data: an object with two keys, text and colors, both of which are arrays
 * of two items (the first for off position, the second for on position). The color
 * values must be tailwindCSS color values (list can be found in tailwindCSS docs).
 *     ex. { text: ["Switch it up", "Ok, go off"], colors: ['bg-green-900', 'bg-stone-800'] }
 *
 *  => changeScreen: a function passed down from parent component that contains
 * the toggle's functionality.
 *
 *  => isChecked: a function passed down from parent component that tracks the
 * state of the toggle.
 *
 * State: none
 *
 * Considerations:
 *  => make sure both pieces of text are around the same length for best results.
 *  => again, colors must be tailwindCSS colors, like those referenced above.
 *  => make sure your chosen colors maintain proper contrast for accessibility -
 *  dark colors are recommended, and you can check the contrast using chrome devtools.
 *
 * Parent component ==> PlantToggle
 */

interface ToggleProps {
    changeScreen: () => void; // Assuming changeScreen is a function with no arguments and no return value
    isChecked: boolean;
  }

function Toggle({ changeScreen, isChecked }: ToggleProps) {
    const toggleData = {
      text: ["Turn On", "Turn Off"],
      colors: ['bg-[var(--pink)]', 'bg-[var(--green)]'],
    };

    console.log("isChecked=", isChecked);

    const { text, colors } = toggleData;

    function handleToggle() {
        console.log("clicked!");
        changeScreen();
    }

    return (
      <div className="Toggle">
        <label className="flex items-center justify-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isChecked}
              onChange={handleToggle}
              aria-checked={isChecked}
              role="switch"
            />
            <div className={`block ${isChecked ? colors[0] : colors[1]} w-24 h-9
            rounded-full shadow-lg focus:outline-visible`}></div>
            <div className={`dot absolute left-0 top-0 bg-[url('/grass-tan.png')]
            bg-no-repeat bg-center bg-contain w-20 h-20 -mt-5 -ml-4 rounded-full transition
            ${isChecked ? 'translate-x-12' : ''}`}></div>
          </div>
          <div className='text text-2xl ml-3 text-stone-800 font-medium mt-2'>
            {isChecked ? text[1] : text[0]}
          </div>
        </label>
      </div>
    );
  }

  export default Toggle;