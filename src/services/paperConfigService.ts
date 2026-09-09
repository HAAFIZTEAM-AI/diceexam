export interface PaperConfig {
  isResultCheckingLocked: boolean; // Default true ("result check ko lock rakho")
  isExamSuspended: boolean;
  examDurationMinutes: number;
  maxHintsAllowed: number; // Exactly 5
  activeParts: number[];
  minimumPassingFloor: number;
}

const CONFIG_KEY = 'dice_paper_config_v1';

export const DEFAULT_PAPER_CONFIG: PaperConfig = {
  isResultCheckingLocked: true, // Default LOCKED per user instruction
  isExamSuspended: false,
  examDurationMinutes: 35,
  maxHintsAllowed: 5, // Exact limit: 5 hints
  activeParts: [1, 2, 3, 4],
  minimumPassingFloor: 25,
};

export function getPaperConfig(): PaperConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PAPER_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Error loading paper config:', e);
  }
  return { ...DEFAULT_PAPER_CONFIG };
}

export function savePaperConfig(config: PaperConfig): PaperConfig {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving paper config:', e);
  }
  return config;
}
