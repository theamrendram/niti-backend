// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  // Create a User (owner)
  const owner = await prisma.user.create({
    data: {
      firstName: "Batman",
      lastName: "Wyane",
      email: "bat@man.com",
      password: "batman@1939"
    },
  });

  // Create an Organization
  const org = await prisma.organization.create({
    data: {
      name: "DevOrg",
      ownerId: owner.id,
    },
  });

  // Create OrgMembership
  await prisma.orgMembership.create({
    data: {
      userId: owner.id,
      organizationId: org.id,
      role: "OWNER",
    },
  });

  // Create a Project
  const project = await prisma.project.create({
    data: {
      name: "Scrum MVP",
      organizationId: org.id,
      createdById: owner.id,
    },
  });

  // Create a Sprint
  const sprint = await prisma.sprint.create({
    data: {
      name: "Sprint 1",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: project.id,
      status: "ACTIVE",
    },
  });

  // Create an Issue (reported by owner, assigned to same user for now)
  const issue = await prisma.issue.create({
    data: {
      title: "Setup project repository",
      description: "Initialize Git repo and set up CI/CD",
      reporterId: owner.id,
      assigneeId: owner.id,
      projectId: project.id,
      sprintId: sprint.id,
      status: "IN_PROGRESS",
      priority: "HIGH",
      issueType: "TASK",
      storyPoints: 3,
    },
  });

  // Add a comment to the issue
  await prisma.comment.create({
    data: {
      content: "Working on this task now.",
      authorId: owner.id,
      issueId: issue.id,
    },
  });

  console.log("Seed data created ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
