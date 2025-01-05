---
title: Introduction
author: Kevin Damm
---

# {{ $frontmatter.title }}

...


## Motivation

There are already numerous sources, easily found on the internet or in books,
describing how to do most (all?) of the basic pieces found in these tutorials,
so why another one?  Why even write about this topic at all?

A few reasons &mdash; mainly it helps preserve my notes on how I've previously
done some of these things, it helps me be consistent across projects;
also the existing material is somewhat scattered, superficial.. and often
lacking in significant security considerations, for the sake of simplicity.

### Why?

To help me through the process of reproducing some of these things, I present
the tutorials as a high-level checklist first, with additional details revealed
when expanded or when certain embedded forms are populated.  I've tried to keep
the material useful to others despite it mainly being a fancy way of keeping
notes.  This usually helps 6-months-plus future me, as well.
<!-- TODO also, the checklists are persisted in localStorage so that you can work through the tutorials in multiple sittings, or as time allows -->

### Who?

The person I've had in mind when writing these is a combination of a few people
who I know IRL who are curious and industrious, and have a range of ability with
writing software.  During my other attempts at writing tutorials and blogs, I've
found it easier to stay on message than to stay on complexity, level-of-detail.
So this time I'm trying something a little different, a kind of tiered approach
that includes the details and may get lengthy but tucks most of it away inside
collapsible `<detail>` blocks where only the `<summary>` is seen.

### How?

This use of `detail` tags is a core part of HTML that doesn't rely on javascript
to give dynamic quality to the view.  I've tried to be consistent about that in
a lot of the tutorials, even using HTMX if it fits, because I think there is
enormous utility in using the languages where they're most suitable.  There is
plenty of Javascript despite that, as all of the Cloudflare workers and much of
the interaction within the tutorial pages, typically use javascript.

The projects I'm creating here should be robust enough to live on in your larger
efforts without a lot of toil, so I've tried to be selective with the libraries
and techniques being chosen.  As a precaution, because there is no certainty
with that kind of thing, I've also written it all in TypeScript and included
unit and integration tests that I hope hit an appropriate level of abstraction
(too precise a test can be brittle, too abstract will miss critical edge cases).

### When?

I plan on getting the first 2-3 tutorials of each section during January 2025.

More details TBD

<!-- TODO a convenient place for visualization of current progress -->

