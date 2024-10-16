import clsx from 'clsx';

const getFormattedPlaceFromNumber = (place: number) => {
  if (place % 10 === 1) return `${place}st`;
  if (place % 10 === 2) return `${place}nd`;
  if (place % 10 === 3) return `${place}rd`;
  return `${place}th`;
};

/**
 * Shows a Product Hunt award.
 *
 * Use this to show a Product Hunt award, if applicable, to increase trust.
 */
export const LandingProductHuntAward = ({
  innerClassName,
  className,
  place = 1,
  subtitle,
  title = 'Top PFP Generator',
  size = 'default',
  grayscale = true,
  textContainerClassName,
  titleClassName,
  placeClassName,
}: {
  innerClassName?: string;
  className?: string;
  place?: number | string;
  subtitle?: string;
  title?: string;
  size?: 'default' | 'small';
  grayscale?: boolean;
  textContainerClassName?: string;
  titleClassName?: string;
  placeClassName?: string;
}) => {
  const placeIsNumber = typeof place === 'number';
  const formattedPlace = placeIsNumber ? getFormattedPlaceFromNumber(place) : place;

  return (
    <div
      className={clsx(
        className,
        'flex h-12 dark:invert',
        !grayscale && place === 1 && 'text-yellow-500 dark:text-yellow-500',
        !grayscale && place === 2 && 'text-gray-400 dark:text-gray-300',
        !grayscale && place === 3 && 'text-amber-600 dark:text-amber-600',
        grayscale || (placeIsNumber && place > 3) ? 'text-[#4B587C]' : ''
      )}
    >
      <div className={clsx(innerClassName, 'relative flex', size === 'small' && 'h-9', size === 'default' && 'h-10')}>
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1241 1996" className={clsx('relative', size === 'default' && 'h-11 -mt-1', size === 'small' && 'h-9  -mt-0.5')}>
          <g clipPath="url(#a)">
            <path
              d="M919.561 1957.48c227.639 88.15 320.199 4.64 320.199-48.06-80.64-6.8-273.323-17.86-320.199 48.06Zm-288.971-72.07a295.902 295.902 0 0 0 195.96 56.75 295.961 295.961 0 0 0 186.12-83.56c-77.682-21.58-289.784-47.15-382.08 26.81Zm385.1-171.33c-8.63 109.67 103.67 171.33 224.94 180.23-22.12-110.32-135.34-159.57-224.94-180.23Zm-217.446-101.1c-12.839 46.88 4.801 174.14 179.251 224.63-7.498-85.93-53.187-197.82-179.251-224.63ZM452.31 1740.57a269.972 269.972 0 0 0 344.423 30.8c-69.909-36.04-237.779-84.7-344.423-30.8Zm184.321-253.87c-23.896 46.17-28.967 177.75 125.471 256.94 8.955-84.69-25.083-229.54-125.471-256.94Zm-382.075 51.14a236.74 236.74 0 0 0 59.379 74.52 236.892 236.892 0 0 0 83.946 45.08 228.845 228.845 0 0 0 93.929 7.36 228.969 228.969 0 0 0 88.937-31.1c-97.367-91.55-252.721-126.67-326.191-95.86Zm230.874-245.3c-69.262 120.84 3.938 258.84 80.105 315.53 33.876-112.31 2.805-234.71-80.051-315.53h-.054Zm-359.365-5.23c-8.362 187.68 187.612 177.48 279.638 178.73-28.967-39.44-189.986-182.4-279.638-178.73Zm241.662-175.32c-36.411 40.08-91.055 194.15 29.939 319.84 37.921-90.9 46.228-230.45-29.939-319.84Zm-344.37-83.19c-6.257 151.59 121.318 228.3 244.361 227.12-37.005-73.05-135.936-213.85-244.36-227.12Zm258.116-104.436c-81.561 48.012-72.283 203.056-24.166 283.756 54.05-75.15 94.4-168.53 24.166-283.756Zm-263.51-142.04C-22.385 920.372 96.18 1013.75 167.332 1021.74c-18.233-65.926-42.13-182.719-149.421-239.416h.053Zm248.514-45.908C176.555 781.461 133.94 889.191 167.6 986.294c62.736-50.548 138.309-157.469 98.877-249.878ZM13.756 569.399c-55.56 167.934 72.013 222.797 119.483 236.284-5.664-71.425-51.084-213.788-119.483-236.284Zm249.161-44.073c-36.465 10.519-140.413 95.862-121.587 248.69 68.4-38.517 151.471-111.883 121.587-248.69Zm-211.51-210.39c-62.141 206.398 41.537 291.147 75.575 308.032 5.394-65.275 11.975-217.78-75.574-308.032Zm230.012 5.179c-65.108 18.18-147.263 137.724-143.379 252.683 64.515-29.562 161.019-152.505 143.379-252.683ZM262 0C110.853 156.227 89.653 279.44 133.832 431.352 202.285 369.746 256.929 184.873 262 0Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h1241v1996H0z" />
            </clipPath>
          </defs>
        </svg>

        <div className={clsx('-mx-1 h-full flex flex-col justify-between items-center', textContainerClassName, size === 'default' && 'py-0.5')}>
          <span className={clsx('font-bold text-current', titleClassName, size === 'default' && 'text-[10px]', size === 'small' && 'text-[9px]')}>{title}</span>
          <span className={clsx('font-bold text-current', placeClassName, size === 'default' && 'text-[16px]', size === 'small' && 'text-[14px]')}>{subtitle || formattedPlace}</span>
        </div>

        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1241 1996" className={clsx('relative', size === 'default' && 'h-11 -mt-1', size === 'small' && 'h-9  -mt-0.5')}>
          <g clipPath="url(#a)" fill="currentColor">
            <path d="M321.121 1957.48C93.483 2045.63.917 1962.12.917 1909.42c80.644-6.8 273.328-17.86 320.204 48.06ZM414.077 1942.16a295.904 295.904 0 0 0 195.96-56.75c-92.296-73.96-304.398-48.39-382.076-26.81a295.942 295.942 0 0 0 186.116 83.56ZM224.94 1714.08c8.631 109.67-103.677 171.33-224.94 180.23 22.116-110.32 135.342-159.57 224.94-180.23ZM442.438 1612.98c12.838 46.88-4.802 174.14-179.252 224.63 7.498-85.93 53.188-197.82 179.252-224.63ZM621.738 1818.35a269.974 269.974 0 0 0 166.633-77.78c-106.644-53.9-274.514-5.24-344.423 30.8a269.98 269.98 0 0 0 177.79 46.98ZM604.049 1486.7c23.897 46.17 28.967 177.75-125.47 256.94-8.955-84.69 25.083-229.54 125.47-256.94ZM926.746 1612.36a236.754 236.754 0 0 0 59.379-74.52c-73.47-30.81-228.824 4.31-326.191 95.86a228.969 228.969 0 0 0 88.937 31.1 228.839 228.839 0 0 0 93.928-7.36 236.896 236.896 0 0 0 83.947-45.08ZM755.251 1292.54c69.262 120.84-3.938 258.84-80.105 315.53-33.876-112.31-2.751-234.71 80.105-315.53ZM1114.62 1287.31c8.36 187.68-187.616 177.48-279.642 178.73 28.967-39.44 189.982-182.4 279.642-178.73ZM872.953 1111.99c36.412 40.08 91.056 194.15-29.938 319.84-37.921-90.9-46.229-230.45 29.938-319.84ZM1217.38 1028.8c6.25 151.59-121.32 228.3-244.363 227.12 37.003-73.05 135.933-213.85 244.363-227.12ZM959.261 924.364c81.559 48.012 72.279 203.056 24.167 283.756-54.051-75.15-94.4-168.53-24.167-283.756ZM1222.72 782.324c40.35 138.048-78.22 231.426-149.37 239.416 18.23-65.926 42.08-182.719 149.37-239.416ZM974.204 736.416c89.926 45.045 132.536 152.775 98.876 249.878-62.74-50.548-138.308-157.468-98.876-249.878ZM1226.92 569.399c55.57 167.934-72.01 222.797-119.48 236.284 5.67-71.425 51.09-213.788 119.48-236.284ZM977.764 525.326c36.466 10.519 140.416 95.862 121.586 248.69-68.4-38.517-151.47-111.883-121.586-248.69ZM1189.27 314.936c62.14 206.398-41.53 291.147-75.57 308.032-5.39-65.275-11.98-217.78 75.57-308.032ZM959.261 320.115c65.109 18.18 147.269 137.724 143.379 252.683-64.51-29.562-161.018-152.505-143.379-252.683ZM978.681 0c151.149 156.227 172.349 279.44 128.169 431.352C1038.4 369.746 983.751 184.873 978.681 0Z" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h1241v1996H0z" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
};
