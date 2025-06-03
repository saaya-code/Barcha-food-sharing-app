import { formatDate, formatTimeAgo, cn } from '../lib/utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toBe('Jan 15, 2024')
    })

    it('should handle string dates', () => {
      const formatted = formatDate('2024-01-15')
      expect(formatted).toBe('Jan 15, 2024')
    })
  })

  describe('formatTimeAgo', () => {
    beforeEach(() => {
      // Mock the current date to ensure consistent test results
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should show "just now" for very recent dates', () => {
      const recent = new Date('2024-01-15T11:59:30Z')
      expect(formatTimeAgo(recent)).toBe('just now')
    })

    it('should show minutes ago', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z')
      expect(formatTimeAgo(fiveMinutesAgo)).toBe('5 minutes ago')
    })

    it('should show hours ago', () => {
      const twoHoursAgo = new Date('2024-01-15T10:00:00Z')
      expect(formatTimeAgo(twoHoursAgo)).toBe('2 hours ago')
    })

    it('should show days ago', () => {
      const threeDaysAgo = new Date('2024-01-12T12:00:00Z')
      expect(formatTimeAgo(threeDaysAgo)).toBe('3 days ago')
    })

    it('should show weeks ago', () => {
      const twoWeeksAgo = new Date('2024-01-01T12:00:00Z')
      expect(formatTimeAgo(twoWeeksAgo)).toBe('2 weeks ago')
    })

    it('should show months ago', () => {
      const threeMonthsAgo = new Date('2023-10-15T12:00:00Z')
      expect(formatTimeAgo(threeMonthsAgo)).toBe('3 months ago')
    })

    it('should show years ago', () => {
      const twoYearsAgo = new Date('2022-01-15T12:00:00Z')
      expect(formatTimeAgo(twoYearsAgo)).toBe('2 years ago')
    })
  })

  describe('cn (className utility)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })

    it('should handle Tailwind CSS conflicts', () => {
      const result = cn('p-2 p-4', 'text-red-500 text-blue-500')
      expect(result).toContain('p-4') // Should keep the latter padding
      expect(result).toContain('text-blue-500') // Should keep the latter text color
    })
  })
})
