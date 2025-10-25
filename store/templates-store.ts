// store/templates-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Template {
	id: string;
	name: string;
	description: string;
	category: string;
	icon: string;
	content: string;
	tags: string[];
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
	usageCount: number;
}

interface TemplatesStore {
	templates: Template[];
	userTemplates: Template[];

	// Template CRUD
	createTemplate: (
		template: Omit<
			Template,
			"id" | "createdAt" | "updatedAt" | "usageCount"
		>
	) => void;
	updateTemplate: (id: string, template: Partial<Template>) => void;
	deleteTemplate: (id: string) => void;
	duplicateTemplate: (id: string) => void;

	// Queries
	getTemplatesByCategory: (category: string) => Template[];
	getPopularTemplates: (limit?: number) => Template[];
	searchTemplates: (query: string) => Template[];
	getTemplateById: (id: string) => Template | undefined;
	incrementUsage: (id: string) => void;

	// Categories
	getCategories: () => string[];
}

export const useTemplatesStore = create<TemplatesStore>()(
	persist(
		(set, get) => ({
			templates: [
				// Default templates
				{
					id: "meeting-notes",
					name: "Meeting Notes",
					description:
						"Structured template for effective meeting notes",
					category: "work",
					icon: "📋",
					content: `# {{Meeting Title}}

**Date:** {{Date}}
**Attendees:** {{Attendees}}
**Location:** {{Location}}

## Agenda
- 
- 
- 

## Discussion Points
### Topic 1
- 
- 

### Topic 2
- 
- 

## Action Items
- [ ] **@Person** - Task description - Due: {{Date}}
- [ ] **@Person** - Task description - Due: {{Date}}

## Decisions Made
1. 
2. 

## Next Steps
- 
- 

## Notes
- 
- `,
					tags: ["meeting", "work", "professional"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "project-plan",
					name: "Project Plan",
					description: "Comprehensive project planning template",
					category: "work",
					icon: "🚀",
					content: `# {{Project Name}}

**Project Lead:** {{Lead Name}}
**Start Date:** {{Start Date}}
**Target Date:** {{Target Date}}
**Status:** {{Status}}

## Overview
{{Project description and goals}}

## Objectives
- [ ] 
- [ ] 
- [ ] 

## Key Results
- **KR1:** 
- **KR2:** 
- **KR3:** 

## Timeline
### Phase 1: Planning ({{Date}} - {{Date}})
- [ ] 
- [ ] 

### Phase 2: Execution ({{Date}} - {{Date}})
- [ ] 
- [ ] 

### Phase 3: Review ({{Date}} - {{Date}})
- [ ] 
- [ ] 

## Team Members
| Role | Name | Responsibilities |
|------|------|------------------|
| | | |
| | | |

## Resources
- 
- 

## Risks & Mitigations
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| | | | |
| | | | |

## Success Metrics
- 
- 
- `,
					tags: ["project", "planning", "management"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "daily-journal",
					name: "Daily Journal",
					description:
						"Reflect on your day with this journal template",
					category: "personal",
					icon: "📔",
					content: `# {{Date}} - Daily Journal

## 🎯 Today's Focus
**Main Goal:** 
**Priority Tasks:**
- [ ] 
- [ ] 
- [ ] 

## 📝 Morning Reflection
**What am I grateful for today?**
1. 
2. 
3. 

**What would make today great?**
- 
- 

**Daily Affirmations**
- 
- 

## 📊 Day Tracking
### Energy Levels
- Morning: ⭐⭐⭐⭐⭐
- Afternoon: ⭐⭐⭐⭐⭐  
- Evening: ⭐⭐⭐⭐⭐

### Mood
- 

## ✅ Completed Tasks
- [x] 
- [x] 

## 🔄 Carry Forward
- [ ] 
- [ ] 

## 🌙 Evening Reflection
**What went well today?**
- 
- 

**What could I improve?**
- 
- 

**Lessons Learned**
- 
- 

**Tomorrow's Preview**
- 
- `,
					tags: ["journal", "personal", "reflection"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "book-notes",
					name: "Book Notes",
					description: "Capture key insights from books you read",
					category: "learning",
					icon: "📚",
					content: `# {{Book Title}}
*by {{Author}}*

**Date Read:** {{Date}}  
**Rating:** ⭐⭐⭐⭐⭐  
**Category:** {{Genre}}

## 🎯 Key Takeaways
1. 
2. 
3. 

## 📖 Summary
{{Brief summary of the book}}

## 💡 Important Concepts
### Concept 1
- 
- 

### Concept 2
- 
- 

## 🎨 Favorite Quotes
> ""
> 
> ""
> 
> ""

## 🔗 Connections
**Related to:** 
**Contradicts:** 
**Expands on:** 

## 🛠️ Practical Applications
- 
- 
- 

## ❓ Questions & Thoughts
- 
- 
- 

## 📚 Related Books
- 
- 
- `,
					tags: ["book", "learning", "notes"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "weekly-review",
					name: "Weekly Review",
					description: "Review your week and plan ahead",
					category: "productivity",
					icon: "🔄",
					content: `# Weekly Review - {{Week of Date}}

## 🎯 This Week's Achievements
### What went well?
- 
- 
- 

### What did I accomplish?
- 
- 
- 

## 📊 Metrics Review
**Tasks Completed:** {{Number}}/{{Total}}
**Notes Created:** {{Number}}
**Focus Time:** {{Hours}}h

## 🔍 Areas for Improvement
### What could have gone better?
- 
- 
- 

### What distracted me?
- 
- 
- 

## 💡 Lessons Learned
- 
- 
- 

## 🎉 Wins & Celebrations
- 
- 
- 

## 📝 Next Week Planning
### Top 3 Priorities
1. 
2. 
3. 

### Habit Tracking
- [ ] Exercise: ▢▢▢▢▢▢▢
- [ ] Reading: ▢▢▢▢▢▢▢
- [ ] Meditation: ▢▢▢▢▢▢▢

### Upcoming Events
- 
- 
- 

## 🎯 Goals for Next Week
- 
- 
- `,
					tags: ["review", "productivity", "planning"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "brainstorming",
					name: "Brainstorming",
					description: "Capture and organize creative ideas",
					category: "creativity",
					icon: "💡",
					content: `# {{Topic}} - Brainstorming

**Date:** {{Date}}
**Participants:** {{Names}}

## 🎯 Objective
{{What are we trying to solve or create?}}

## 💡 Idea Generation
### Category 1
- 
- 
- 

### Category 2  
- 
- 
- 

### Category 3
- 
- 
- 

## 🔍 Idea Evaluation
| Idea | Pros | Cons | Feasibility | Impact |
|------|------|------|-------------|--------|
| | | | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| | | | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| | | | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## 🎨 Top Ideas
### Idea 1: 
**Description:** 
**Why it works:** 
**Next steps:** 

### Idea 2:
**Description:** 
**Why it works:** 
**Next steps:** 

## 🚀 Action Plan
- [ ] 
- [ ] 
- [ ] 

## 💭 Additional Thoughts
- 
- 
- `,
					tags: ["brainstorm", "ideas", "creativity"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "interview-notes",
					name: "Interview Notes",
					description: "Structured template for interview notes",
					category: "work",
					icon: "👔",
					content: `# Interview with {{Candidate Name}}
*for {{Position}}*

**Date:** {{Date}}
**Interviewer:** {{Your Name}}
**Status:** {{Scheduled/Completed/Offered}}

## Candidate Information
**Current Role:** 
**Company:** 
**Experience:** {{Years}} years
**Location:** 

## First Impressions
- 
- 

## Technical Assessment
### Strengths
- 
- 

### Areas for Development
- 
- 

## Cultural Fit
**Values Alignment:**
- 
- 

**Team Compatibility:**
- 
- 

## Key Questions & Answers
### Question 1
**Answer:** 

### Question 2  
**Answer:** 

### Question 3
**Answer:** 

## Skills Evaluation
| Skill | Rating | Notes |
|-------|--------|-------|
| | ⭐⭐⭐⭐⭐ | |
| | ⭐⭐⭐⭐⭐ | |
| | ⭐⭐⭐⭐⭐ | |

## Red Flags
- 
- 

## Green Flags
- 
- 

## Overall Assessment
**Strengths:**
- 
- 

**Concerns:**
- 
- 

**Recommendation:** {{Strong Yes/Yes/No/Strong No}}

## Next Steps
- [ ] 
- [ ] 
- [ ] `,
					tags: ["interview", "hr", "work"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
				{
					id: "shopping-list",
					name: "Shopping List",
					description: "Organized shopping list template",
					category: "personal",
					icon: "🛒",
					content: `# Shopping List - {{Date}}

## 🛒 Groceries
### 🥦 Produce
- [ ] 
- [ ] 
- [ ] 

### 🥩 Meat & Seafood
- [ ] 
- [ ] 
- [ ] 

### 🥛 Dairy & Eggs
- [ ] 
- [ ] 
- [ ] 

### 🍞 Bakery
- [ ] 
- [ ] 
- [ ] 

### 🧴 Household
- [ ] 
- [ ] 
- [ ] 

## 🏠 Home & Kitchen
- [ ] 
- [ ] 
- [ ] 

## 💊 Pharmacy
- [ ] 
- [ ] 
- [ ] 

## 👕 Personal Care
- [ ] 
- [ ] 
- [ ] 

## 📝 Notes
- Store: 
- Budget: {{ Amount }}
- Priority: {{High/Medium/Low}}

## 🎯 Done When
- [ ] All items purchased
- [ ] Within budget
- [ ] Nothing forgotten!`,
					tags: ["shopping", "personal", "list"],
					isPublic: true,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					usageCount: 0,
				},
			],
			userTemplates: [],

			createTemplate: (template) => {
				set((state) => ({
					userTemplates: [
						...state.userTemplates,
						{
							...template,
							id: crypto.randomUUID(),
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
							usageCount: 0,
						},
					],
				}));
			},

			updateTemplate: (id, template) => {
				set((state) => {
					const updateTemplates = (templates: Template[]) =>
						templates.map((t) =>
							t.id === id
								? {
										...t,
										...template,
										updatedAt: new Date().toISOString(),
								  }
								: t
						);

					return {
						templates: updateTemplates(state.templates),
						userTemplates: updateTemplates(state.userTemplates),
					};
				});
			},

			deleteTemplate: (id) => {
				set((state) => ({
					userTemplates: state.userTemplates.filter(
						(t) => t.id !== id
					),
				}));
			},

			duplicateTemplate: (id) => {
				const state = get();
				const template =
					state.templates.find((t) => t.id === id) ||
					state.userTemplates.find((t) => t.id === id);

				if (template) {
					set((state) => ({
						userTemplates: [
							...state.userTemplates,
							{
								...template,
								id: crypto.randomUUID(),
								name: `${template.name} (Copy)`,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
								usageCount: 0,
							},
						],
					}));
				}
			},

			getTemplatesByCategory: (category) => {
				const state = get();
				const allTemplates = [
					...state.templates,
					...state.userTemplates,
				];
				return allTemplates.filter(
					(template) =>
						template.category === category && template.isPublic
				);
			},

			getPopularTemplates: (limit = 8) => {
				const state = get();
				const allTemplates = [
					...state.templates,
					...state.userTemplates,
				];
				return allTemplates
					.filter((template) => template.isPublic)
					.sort((a, b) => b.usageCount - a.usageCount)
					.slice(0, limit);
			},

			searchTemplates: (query) => {
				const state = get();
				const allTemplates = [
					...state.templates,
					...state.userTemplates,
				];
				const lowercaseQuery = query.toLowerCase();

				return allTemplates.filter(
					(template) =>
						template.name.toLowerCase().includes(lowercaseQuery) ||
						template.description
							.toLowerCase()
							.includes(lowercaseQuery) ||
						template.tags.some((tag) =>
							tag.toLowerCase().includes(lowercaseQuery)
						) ||
						template.category.toLowerCase().includes(lowercaseQuery)
				);
			},

			getTemplateById: (id) => {
				const state = get();
				return (
					state.templates.find((t) => t.id === id) ||
					state.userTemplates.find((t) => t.id === id)
				);
			},

			incrementUsage: (id) => {
				set((state) => {
					const updateUsage = (templates: Template[]) =>
						templates.map((t) =>
							t.id === id
								? { ...t, usageCount: t.usageCount + 1 }
								: t
						);

					return {
						templates: updateUsage(state.templates),
						userTemplates: updateUsage(state.userTemplates),
					};
				});
			},

			getCategories: () => {
				return [
					"all",
					"work",
					"personal",
					"productivity",
					"learning",
					"creativity",
				];
			},
		}),
		{
			name: "nextnote-templates-storage",
		}
	)
);
